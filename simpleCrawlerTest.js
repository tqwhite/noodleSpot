#!/usr/local/bin/node
"use strict";

var	fs=require("fs"),
	Crawler=require('simplecrawler');
 
 
Crawler.crawl("http://justkidding.com/", function(queueItem){
    console.log("Completed fetching resource:",queueItem.url);
});