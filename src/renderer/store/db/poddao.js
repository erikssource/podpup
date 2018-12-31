import Sequelize from 'sequelize';
import path from 'path';
import fs from 'fs';

import config from '../modules/config';

/*
if (!fs.existsSync(config.state.poddir)) {
   fs.mkdirSync(config.state.poddir, {recursive: true});
}
*/

const sequelize = new Sequelize('poddb', null, null, {
   dialect: 'sqlite',
   storage: path.join('/home/erik/podpup2', 'podpup.db'),
   logging: () => {}
});

const Config = sequelize.define('config', {
      name: {
         type: Sequelize.STRING,
         allowNull: false
      },
      settings: {
         type: Sequelize.JSON
      }
});

const Feed = sequelize.define('pod', {
      title: {
         type: Sequelize.STRING,
         allowNull: false
      },
      author: {
         type: Sequelize.STRING
      },
      url: {
         type: Sequelize.STRING,
         allowNull: false
      },
      lastupdate: {
         type: Sequelize.DATE
      },
      image: {
         type: Sequelize.STRING
      },
      summary: {
         type: Sequelize.TEXT
      },
      description: {
         type: Sequelize.TEXT
      },
      link: {
         type: Sequelize.STRING
      },
      maxeps: {
         type: Sequelize.INTEGER,
         defaultValue: 150
      },
      checktime: {
         type: Sequelize.INTEGER,
         defaultValue: 0
      },
      autodown: {
         type: Sequelize.BOOLEAN,
         defaultValue: false
      },
      maxdown: {
         type: Sequelize.INTEGER,
         defaultValue: 0
      },
      downttl: {
         type: Sequelize.INTEGER,
         defaultValue: 0
      },
      ppupdate: {
         type: Sequelize.DATE,
         defaultValue: Sequelize.NOW
      },
      settings: {
         type: Sequelize.JSON
      }
   },
   {
      indexes: [
         {
            fields: ['title']
         },
         {
            fields: ['lastupdate']
         }
      ]
   }
);

const Episode = sequelize.define('episode', {
      guid: {
         type: Sequelize.STRING
      },
      title: {
         type: Sequelize.STRING,
         allowNull: false
      },
      description: {
         type: Sequelize.TEXT
      },
      published: {
         type: Sequelize.DATE
      },
      duration: {
         type: Sequelize.INTEGER
      },
      filesize: {
         type: Sequelize.INTEGER
      },
      mimetype: {
         type: Sequelize.STRING,
         allowNull: false
      },
      url: {
         type: Sequelize.STRING,
         allowNull: false
      },
      filename: {
         type: Sequelize.STRING
      },
      detached: {
         type: Sequelize.BOOLEAN,
         defaultValue: false
      },
      hidden: {
         type: Sequelize.BOOLEAN,
         defaultValue: false
      },
      keeper: {
         type: Sequelize.BOOLEAN,
         defaultValue: false
      },
      played: {
         type: Sequelize.BOOLEAN,
         defaultValue: false
      },
      bookmark: {
         type: Sequelize.INTEGER,
         defaultValue: 0
      },
      settings: {
         type: Sequelize.JSON
      },
      pod_id: {
         type: Sequelize.INTEGER,
         references: {
            model: Feed,
            key: 'id'
         }
      }
   },
   {
      indexes: [
         {
            fields: ['title']
         },
         {
            fields: ['published']
         },
         {
            fields: ['pod_id']
         },
         {
            fields: ['guid']
         }
      ]
   }
);

/* jshint ignore:start */

export default {
   initialize() {
      Feed.sync()
      Episode.sync()
      Feed.hasMany(Episode, {as: 'Episodes', foreignKey: 'pod_id', sourceKey: 'id'})
      Episode.belongsTo(Feed, {foreignKey: 'pod_id', targetKey: 'id'})
   },
   getAllPods() {
      return Feed.findAll({
         order: [['title', 'DESC']]
      })
   },
   getPodcast(podstub) {
      return Feed.findByPk(podstub.id, {
         include: [{
            model: Episode,
            as: 'Episodes'
         }],
         order: [[
            {model: Episode, as: 'Episodes'}, 'published', 'DESC'
         ]]
      })
   },
   getAllEpisodes(feed) {
      return Episode.findAll({
         where: {
            pod_id: feed.id,
            hidden: false
         },
         order: [['published', 'DESC']]
      })
   },
   async addPodcastStub(title, lastupdate, url) {
      let podcast = await Feed.create({
         title: title,
         url: url,
         lastupdate: lastupdate
      });
      return podcast;
   },
   async addPodcast(data, url) {
      let podcast = await Feed.create({
         title: data.title,
         author: data.author,
         lastupdate: data.updated,
         url: url,
         image: data.image,
         link: data.link,
         summary: data.description.short,
         description: data.description.long
      })
      await this.addEpisodes(podcast, data)
      return podcast
   },
   async loadPodcast(id, data, url) {
      let podcast = await Feed.findByPk(id)
      if (podcast === null) {
         return addPodcast(data, url)
      }
      await podcast.update({
         author: data.author,
         lastupdate: data.updated,
         image: data.image,
         link: data.link,
         summary: data.description.short,
         description: data.description.long
      })
      await this.addEpisodes(podcast, data)
      return podcast
   },
   async updatePodcast(id, data) {
      let podcast = await Feed.findByPk(id)
      return podcast.update(data);
   },
   async removePodcast(pod) {
      let podcast = await Feed.findByPk(pod.id);
      await this.deleteEpisodes(podcast.id);
      return sequelize.query('DELETE FROM pods WHERE id=?', 
            { replacements: [podcast.id], type: sequelize.QueryTypes.DELETE });
   },
   async removePodcastByTitle(title) {
      try {
         await Feed.destroy({
            where: {
               title: title
            }
         });
      }
      catch (err) {
         console.error("Error Deleting Podcast by Title: ", err);
      }
   },
   async addEpisode(podcast, ep) {
      let episode = await Episode.create({
         pod_id: podcast.id,
         guid: ep.guid,
         title: ep.title,
         description: ep.description,
         published: ep.published,
         duration: ep.duration,
         filesize: ep.enclosure.filesize,
         mimetype: ep.enclosure.type,
         url: ep.enclosure.url
      })
      return episode;
   },
   async addEpisodes(feed, data) {
      data.episodes.forEach((ep) => {
         this.addEpisode(feed, ep)
      })
   },
   async updateEpisode(id, data) {
      try {
         let ep = await Episode.findByPk(id);
         return ep.update(data);
      }
      catch (err) {
         //TODO: Notify user of error. (Will require refactoring)
         console.log("Error updating episode");
         return;
      }      
   },
   async deleteEpisodes(podId) {
      return sequelize.query('DELETE FROM episodes WHERE pod_id=?',
         { replacements: [podId], type: sequelize.QueryTypes.DELETE }
      )
   },
   unhideAllEpisodes(podcast) {
      return Episode.update(
         {hidden: false},
         { where: { pod_id: podcast.id }}
      );
   },
   getEpisodeGuids(podcast) {
      return Episode.findAll({
         where: { pod_id: podcast.id },
         attributes: ['guid']
      })
   }
}

/* jshint ignore:end */