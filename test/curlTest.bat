REM curl https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=surfing&key=AIzaSyArNdSiqTFy8aFItbBKx_1FxHTBF6t5Aps -H 'Authorization: Bearer 109044502732115486184' -H 'Accept: application/json' --compressed
REM this does not work because it just tries to use the pre-made project.
curl -H @curlTest.header.txt https://www.youtube.com/results?search_query=Frozen

REM <body dir="ltr" >
REM <script > window["ytInitialData"] ={
REM contents, twoColumnSearchResultsRenderer, primaryContents, sectionListRenderer, contents,1, itemSectionRenderer, contents, 0, videoRenderer, videoId