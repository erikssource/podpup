Podpup Guide
------------

### Still Pre-Alpha
As much as I'd like to say that Podpup has reached the Alpha stage, there just aren't enough features implemented for that. If you want to play around with it or want to contribute to the probject, then it's ready to play with. However, if you are looking for new podcast fetcher to use, this project isn't there yet. I use it for all my podcast listening on my computer, but I'm willing to put up with the missing features and having to start over when a big change breaks the current database schema. 

### Development Notes
With version 0.3, the database code has been completely rewritten. Originally, Podpup was developed using ORM (object relational mapping) software to handle database access, but the database needs of Podpup are very modest and using ORM felt too heavy. With 0.3, the ORM layer has been removed and the database access layer simply queries the database with SQL. This allowed the elimination of several dependencies and reduced overhead for database operations. Unfortunately, this also changed the database schema which means that moving from 0.2 to 0.3 will require deleting the podpup data directory and starting over. Stuff like this is why I'm not calling 0.3 alpha quality yet.

Version 0.4 will see the removal of the linkedlist code and replacing with the the linkedlistpup package. It's pretty similar code since the linkedlistpup package is based on the code from podpup. Aside from that minor change, I'm planning to start implementing the background tasks that will do that automatic refreshing of feeds and automatic downloading of episodes. That will mean adding some more settings the feeds. At that point, all the major infrastruture will be in place. In parallel to the coding, I'll be adding the user guide.

### Installing Podpup
If you are interested in contributing to the project and want to install Podpup to develop. Then you probably know the drill, you'll need nodejs installed and will need to clone the repository. See the repo readme for more information. If you want to use the early-days version of Podpup as a user, then you go to the releases and download the AppImage file for 64-bit Linux or the Windows installer for Windows. Making a Mac OS installer available will come at some point.

### User Guide
In the works...
