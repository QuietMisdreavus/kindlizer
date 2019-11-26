# kindlizer

this is a quick-and-dirty server to render arbitrary web articles to DOCX, and return them to the
user. by going to `http://<site>:8080/article?url=<url>` and providing a URL, the server will:

* fetch the URL
* parse the contents with [mercury-parser]
* convert to DOCX using [pandoc]
* send this file in the response

[mercury-parser]: https://github.com/postlight/mercury-parser
[pandoc]: https://pandoc.org/

this exists for one specific purpose: sending web articles to my kindle. (hence the DOCX instead of
EPUB; the kindle can't read EPUB files, and pandoc can't output MOBI.) by hosting this on a personal
server, i can hook into it with iOS Shortcuts and email things to my kindle from my phone. (figuring
it out on desktop is left as an exercise to the reader; personally i'm okay with manually emailing
it afterward.)

it's also my first node project, so it was kinda fun to get my footing with a new environment.
