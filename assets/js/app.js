//TODO: add secret parameter to query URL
var YTK = YTK || {};

YTK.apiPlay = (function() {
  var 
  topics = ['cat', 'dog'],
  giphyKey = 'gDuZhVfBtBZJTRApZL2OqJ49bxEOrN2W',
  giphyURL = 'https://api.giphy.com/v1/gifs/search',
  makeQuery = function(apiURL, paramObj) {
    return apiURL + '?' + $.param(paramObj);
  },
  callAPI = function(url, callback) {
    $.ajax({
      url: url,
    }).done(function(results) {
      callback(results.data);
    });
  },
  getImgObj = function(imgObj) {
    var 
    img = {
      still : imgObj.original_still.url,
      gif   : imgObj.original.url
    }

    return img;
  },
  clearResults = function() {
    $('.images-row', '.pictures').empty();
  },
  makeCard = function(rating, imgObj) {
    var $resultDiv = $('<div/>', {
      class : 'result col-4',
      'data-moving' : 'false',
      click : function() {
        var moving = $(this).attr('data-moving');

        if (moving == 'false') {
          $(this).attr('data-moving', 'true');
          $(this).find('img').attr('src', imgObj.gif);
        }
        else {
          $(this).attr('data-moving', 'false');
          $(this).find('img').attr('src', imgObj.still);
        }
      }
    }),
    $ratingDiv  = $('<div class="row rating">Rating: ' + rating +'</div>'),
    $imgDiv     = $('<div class="row image"><img src="' + imgObj.still + '">');

    $resultDiv.append($ratingDiv);
    $resultDiv.append($imgDiv);

    $('.images-row', '.pictures').append($resultDiv);
  },
  putResults = function(results) {
    clearResults();
    $.each(results, function(index, result) {
      makeCard(result.rating, getImgObj(result.images));
    });
  },
  makeBtn = function(apiURL, topicStr) {
    return $('<button/>', {
      text: topicStr,
      class: 'btn btn-success',
      click: function() {
        callAPI(makeQuery(giphyURL, {api_key : giphyKey, q : topicStr, limit : 10}),
          putResults)
      }
    });
  },
  putBtn = function(topicStr) {
    var $btnDiv = $('.btn-area');
    $btnDiv.append(makeBtn(giphyURL, topicStr));
  },
  addBtn = function($txtBox) {
    var btnVal = $txtBox.val();


    $txtBox.val('');

    if (btnVal.trim() !== '' && $.inArray(btnVal, topics) === -1) {
      topics.push(btnVal);
      putBtn(btnVal);  
    }
  },
  bindAddBtn = function() {
    var $addBtn = $('.kao-btn'),
        $txtBox = $('.newBtn-text');

    $txtBox.on('keyup', function(e) {
      if (e.keyCode == 13) {
        addBtn($txtBox);
      }
    });

    $addBtn.on('click', function() {
      addBtn($txtBox);
    });

  },
  getBtnsFromTopics = function () {
    $.each(topics, function(index, value) {
      putBtn(value);
    });
  },
  initPage = function() {
    getBtnsFromTopics();
    bindAddBtn();
  };

return {
    initPage : initPage
  }
})();

$(function() {
  YTK.apiPlay.initPage();
});