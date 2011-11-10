function ajaxget(url) {
    var xhr = new XMLHttpRequest();
/*    xhr.onreadystatechange = function(data) {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                callback(data.target.responseText);
            }
            else {
                callback(null);
            }
        }
    }*/
    xhr.open('GET', url, false);
    xhr.send();
    return xhr.responseText;
}

function getQueryUrl(query) {
    //data is book title
    var timestamp = new Date().getTime();
    var url = "http://shu.im/search/all?q={{query}}&limit=1&timestamp="+timestamp;
    url = url.replace("{{query}}", query);
    return url;
}

function getBookUrl(id) {
    return "http://shu.im/books/"+id;
}

function getButton(url) {
    var btn;
    if (url != '') {
        btn = '<a href="'+url+'?rel=doubanbook2shuim"  title="点击去 shu.im 下载电子版" style="float:left;display: inline-block;background: #33A057;border: 1px solid #2F7B4B;color: white;padding: 1px 10px;border-radius:3px;margin-right: 8px;" target="_blank">shu.im</a>';
    }
    else {
        btn = '<a href="http://shu.im/books/new?title='+ query +'&rel=doubanbook2shuim" title="shu.im 没有找到书籍的电子版，如果你有，可以点击创建书籍" style="float:left;display: inline-block;background: #cc2b2f;border: 1px solid #cc0007;color: white;padding: 1px 10px;border-radius:3px;margin-right: 8px;" target="_blank">shu.im</a>';
    }
    return btn;
}

function handleResult(content) {
    var info = content.split('#!#');
    var title = info[0];
    var id = info[1];
    if (title == query) {
        var url = getBookUrl(id);
        return getButton(url);
    }
    else {
        return getButton('');
    }
}

function sendQuery(query) {
    var content = ajaxget(getQueryUrl(query));
    var btn = handleResult(content);
    return btn;
}

var url = window.location.toString();
var query;

// Book Page
if ( url.indexOf('subject')!=-1 ){
    query = $("#mainpic img").attr("alt"); 
    var btn = $(sendQuery(query));
    $('div.a_stars').before(btn);
}

// People's Book List Page
else if( (url.indexOf('mine')!=-1)||(url.indexOf('people')!=-1) ){
    $('div.item ul').each(function(){
        query = $('li.title a em', this).html();
        var btn = $(sendQuery(query));
        $('div.opt-r', this).after(btn.css("float","right"));
    });
}

// System's Book List Page : doulist
else if( url.indexOf('doulist')!=-1 ){
    $('div.article table').each(function(){
        query = $('div.pl2 a', this).html();
        var btn = $(sendQuery(query));
        $('td > span.rr', this).prepend(btn);
    });
}

// System's Book List Page : tag
else if( url.indexOf('tag')!=-1 ){
    $('div.article table').each(function(){
        query = $('div.pl2 a', this).html();
        var btn = $(sendQuery(query));
        $('td p span.rr', this).prepend(btn);
    });
}