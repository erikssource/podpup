import Vue from 'vue'
import Sequelize from 'sequelize'
import * as Promise from 'bluebird'
import path from 'path'
import fs from 'fs'

import config from '../modules/config'

if (!fs.existsSync(config.state.poddir)) {
   fs.mkdirSync(config.state.poddir, {recursive: true})
}

const sequelize = new Sequelize('poddb', null, null, {
   dialect: 'sqlite',
   storage: path.join(config.state.poddir, 'podpup.db'),
   logging: () => {}
})

const Feed = sequelize.define('pod', {
      title: {
         type: Sequelize.STRING,
         allowNull: false
      },
      author: {
         type: Sequelize.STRING
      },
      url: {
         type: Sequelize.STRING
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
)

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
         }
      ]
   }
)

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
            pod_id: feed.id
         },
         order: [['published', 'DESC']]
      })
   },
   addPodcast(data, url, cb) {
      Feed.create({
         title: data.title,
         author: data.author,
         lastupdate: data.updated,
         url: url,
         image: data.image,
         link: data.link,
         summary: data.description.short,
         description: data.description.long
      }).then((feed) => {
         cb(feed)
         this.addEpisodes(feed, data)
      })
   },
   addEpisode(feed, ep) {
      return Episode.create({
         pod_id: feed.id,
         guid: ep.guid,
         title: ep.title,
         description: ep.description,
         published: ep.published,
         duration: ep.duration,
         filesize: ep.enclosure.filesize,
         mimetype: ep.enclosure.type,
         url: ep.enclosure.url
      })
   },
   addEpisodes(feed, data) {
      let podId = feed.id
      let tasks = []
      data.episodes.forEach((ep) => {
         tasks.push(this.addEpisode(feed, ep))
      })
      return Promise.all(tasks)
   },
   updateEpisode(id, data) {
      Episode.findByPk(id).then((ep) => {
         ep.update(data).then(() => {})
      })
   },
   getEpisodeGuids(podcast) {
      return Episode.findAll({
         where: { pod_id: podcast.id },
         attributes: ['guid']
      })
   }
}

