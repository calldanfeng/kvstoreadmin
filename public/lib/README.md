About semantic lib.

Semantic is available in bower so it should be in the public/components folder, which is downloaded by running
bower install.

But because of the following reasons, some of the semantic files are modified:
1. semantic uses google web font which is not available in China: https://fonts.googleapis.com/css
2. semantic v2.2.2 has a bug that items contain special chars in the multiple input searchable dropdown box
   can not be deleted by clicking the 'x' button.
