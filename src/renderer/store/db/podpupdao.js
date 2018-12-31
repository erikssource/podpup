import Sqlite from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import printf from 'printf';

const createConfigTable = "CREATE TABLE IF NOT EXISTS config ( " +
   "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
   "key VARCHAR(255) NOT NULL, " +
   "value VARCHAR(255) " +
   ")";

const createPodsTable = "CREATE TABLE IF NOT EXISTS pods ( " +
   "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
   "title VARCHAR(255) NOT NULL, " +
   "author VARCHAR(255), " +
   "url VARCHAR(255) NOT NULL, " +
   "lastupdate DATETIME, " +
   "image VARCHAR(255), " +
   "summary TEXT, " +
   "description TEXT, " +
   "link VARCHAR(255), " +
   "maxeps INTEGER DEFAULT 150, " +
   "checktime INTEGER DEFAULT 0, " +
   "autodown TINYINT(1) DEFAULT 0, " +
   "maxdown INTEGER DEFAULT 0, " +
   "downttl INTEGER DEFAULT 0, " +
   "ppupdate DATETIME, " +
   "settings JSON)";

const createPodTitleIndex = "CREATE INDEX IF NOT EXISTS pods_title ON pods (title)";
const createPodLastUpdateIndex = "CREATE INDEX IF NOT EXISTS pods_lastupdate ON pods (lastupdate)";

const createEpisodesTable = "CREATE TABLE IF NOT EXISTS episodes ( " +
   "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
   "guid VARCHAR(255), " +
   "title VARCHAR(255) NOT NULL, " +
   "description TEXT, " +
   "published DATETIME, " +
   "duration INTEGER, " +
   "filesize INTEGER, " +
   "mimetype VARCHAR(255) NOT NULL, " +
   "url VARCHAR(255) NOT NULL, " +
   "filename VARCHAR(255), " +
   "detached TINYINT(1) DEFAULT 0, " +
   "hidden TINYINT(1) DEFAULT 0, " +
   "keeper TINYINT(1) DEFAULT 0, " +
   "played TINYINT(1) DEFAULT 0, " +
   "bookmark INTEGER DEFAULT 0, " +
   "settings JSON, " +
   "pod_id INTEGER REFERENCES pods (id) ON DELETE CASCADE ON UPDATE CASCADE)";

const createEpisodesGuidIndex = "CREATE INDEX IF NOT EXISTS episodes_guid ON episodes (guid)";
const createEpisodesPodId = "CREATE INDEX IF NOT EXISTS episodes_pod_id ON episodes (pod_id)";
const createEpisodesPublished = "CREATE INDEX IF NOT EXISTS episodes_published ON episodes (published)";
const createEpisodesTitle = "CREATE INDEX IF NOT EXISTS episodes_title ON episodes (title)";

const selectPodBase = "SELECT id, title, author, url, lastupdate, image, summary, " +
   "description, link, maxeps, checktime, autodown, maxdown, downttl, ppupdate, settings " +
   "FROM pods";

const seletEpisodeBase = "SELECT id, guid, title, description, published, duration, " +
   "filesize, mimetype, url, filename, detached, hidden, keeper, played, bookmark, settings, pod_id " +
   "FROM episodes";

const selectAllPods = selectPodBase + " ORDER BY title DESC";

const selectEpisodesForFeed = selectEpisodeBase + " WHERE pod_id = ? AND hidden = false ORDER BY published DESC";

const selectPodByPk = selectPodBase + " WHERE id = ?";

const selectPodByTitle = selectPodBase + " WHERE title = ?";

const addPodcastStub = "INSERT INTO pods (title, url, lastupdate) VALUES ( ?, ?, ? )";

const getPodcastStub = "SELECT id, title, url, lastupdate FROM pods WHERE title = ?";

const addPodcast = "INSERT INTO pods (title, author, lastupdate, url, image, link, summary, description) " + 
   "VALUES ( ?, ?, ?, ?, ?, ?, ?, ?)";

const updatePodcastStub = "UPDATE pods SET author = ?, lastupdate = ?, image = ?, link = ?, summary = ?, description = ? " +
   "WHERE id = ?";

const updatePodcastColumn = "UPDATE pods SET %s = ? WHERE id = ?";

const deletePodcast = "DELETE FROM pods WHERE id = ?";

const addEpisode = "INSERT INTO episodes (pod_id, guid, title, description, published, duration, filesize, " + 
   "mimetype, url) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ? )";

const updateEpisodeColumn = "UPDATE episodes SET %s = ? WHERE id = ?";

const getEpisodeGuids = "SELECT guid FROM episodes WHERE pod_id = ?";

const getEpisodeByGuid = selectEpisodeBase + " WHERE guid = ?";

let db = null;

export default {
   initialize(poddir) {

      if (!fs.existsSync(poddir)) {
         fs.mkdirSync(poddir, {recursive: true});
      }

      let dbfile = path.join(poddir, 'podpup.db');
      db = new Sqlite(dbfile);
      try {
         db.prepare(createConfigTable).run();

         db.prepare(createPodsTable).run();
         db.prepare(createPodTitleIndex).run();
         db.prepare(createPodLastUpdateIndex).run();

         db.prepare(createEpisodesTable).run();
         db.prepare(createEpisodesGuidIndex).run();
         db.prepare(createEpisodesPodId).run();
         db.prepare(createEpisodesPublished).run();
         db.prepare(createEpisodesTitle).run();
      }
      catch(err) {
         console.error("Error initializing the database: ", err);
      }
   },

   getAllPods() {
      let rows = db.prepare(selectAllPods).all();
      if (rows) {
         pods = [];
         rows.forEach((r) => {
            pods.push(this._rowToPod(r));
         });
         return pods;
      }
      else {
         return [];
      }
   },

   getPodcastFromStub(podstub) {
      return this._getSinglePod(selectPodByPk, podstub.id);
   },

   getPodcastByTitle(title) {
      return this._getSinglePod(selectPodByTitle, title);
   },

   getAllEpisodes(podcast) {
      let rows = db.prepare(selectEpisodesForFeed).bind(podcast.id).all();
      if (rows) {
         episodes = [];
         rows.forEach((r) => {
            episodes.push(this._rowToEpisode(r));
         });
         return episodes;
      }
      return [];
   },

   addPodcastStub(title, lastupdate, url) {
      db.prepare(addPodcastStub).bind(title, lastupdate, url).run();
      return this.getPodcastStub(title);
   },

   addPodcast(data, url) {
      db.prepare(addPodcast).bind(
         data.title,
         data.author,
         data.updated,
         url,
         data.image,
         data.link,
         data.description.short,
         data.description.long
      ).run();

      return getPodcastByTitle(data.title);
   },

   getPodcastStub(title) {
      let row = db.prepare(getPodcastStub).bind(title).get();
      if (row) {
         return this._rowToPod(row);
      }
      return null;
   },

   loadPodcast(id, data, url) {
      let podcast = this._getSinglePod(selectPodByPk, id);
      if (podcast) {
         db.prepare(updatePodcastStub).bind(
            data.author,
            data.updated,
            data.image,
            data.link,
            data.description.short,
            data.description.long
         ).run();
         podcast.author = data.author;
         podcast.lastupdate = data.updated;
         podcast.image = data.image;
         podcast.link = data.link;
         podcast.summary = data.description.short;
         podcast.description = data.description.long;

         return podcast;
      }
      else {
         this.addPodcast(data, url);
      }
   },

   addEpisodes(pod_id, data) {
      data.episodes.forEach((ep) => {
         this._addEpisodeNoReturn(pod_id, ep);
      });
   },

   addEpisode(pod_id, ep) {
      this._addEpisodeNoReturn(pod_id, ep);
      return getEpisodeByGuid(ep.guid);
   },

   getEpisodeByGuid(guid) {
      let row = db.prepare(getEpisodeByGuid).bind(guid).get();
      if (row) {
         return this._rowToEpisode(row);
      }
      return null;
   },

   shutdown() {
      if (db) {
         db.close();
      }
   },

   _addEpisodeNoReturn(pod_id, ep) {
      db.prepare(addEpisode).bind(
         pod_id,
         ep.guid,
         ep.title,
         ep.description,
         ep.published,
         ep.duration,
         ep.enclosure.filesize,
         ep.enclosure.type,
         ep.enclosure.url
      ).run();
   },

   _getSinglePod(sql, value) {
      let row = db.prepare(sql).bind(value).get();
      if (row) {
         return this._rowToPod(row);
      }
      return null;
   },

   _updatePodColumn(id, col, value) {
      db.prepare(printf(updatePodcastColumn, col)).bind(value, id).run();
   },

   _updateEpisodeColumn(id, col, value) {
      db.prepare(printf(updateEpisodeColumn, col)).bind(value, id).run();
   },

   _rowToPod(row) {
      let pod = row;
      // Translate Booleans
      pod.autodown = (row.autodown !== 0);
      // Add transient properties
      pod.fresh = 0;
      return pod;
   },

   _rowToEpisode(row) {
      let episode = row;
      // Translate Booleans
      episode.detached = (row.detached !== 0);
      episode.hidden   = (row.hidden !== 0);
      episode.keeper   = (row.keeper !== 0);
      episode.played   = (row.played !== 0);
      // Add transient properties
      return row;
   }
};