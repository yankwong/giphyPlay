//TODO: add secret parameter to query URL
var YTK = YTK || {};

YTK.apiPlay = (function() {
  var 
  topics = ['cat', 'dog'],
  giphyKey = 'gDuZhVfBtBZJTRApZL2OqJ49bxEOrN2W',
  giphyURL = 'https://api.giphy.com/v1/gifs/search',
  filterStr = '',
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
      class : 'result col-6 col-md-4',
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
        callAPI(makeQuery(giphyURL, {api_key : giphyKey, q : (filterStr + ' ' + topicStr).trim(), limit : 10}),
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
  updateFilterLooks = function($activeBtn) {
    var $filterBtns = $('.btn', '.filter-btns');

    $filterBtns.removeClass('btn-info');
    $filterBtns.addClass('btn-outline-info');
    $activeBtn.removeClass('btn-outline-info');
    $activeBtn.addClass('btn-info');
  },
  setFilter = function(str) {
    filterStr = str;
  },
  updatePageBkg = function(str) {
    $('body').attr('class', '');
    if (str === 'rainbow') {
      $('body').addClass('rainbow');
    }
    else if (str === 'bw') {
      $('body').addClass('bw');
    }
  },
  bindFilterBtns = function() {
    var $filterBtns = $('.btn', '.filter-btns');

    $filterBtns.on('click', function() {
      var $this = $(this),
          filterStr = $this.attr('data-filter');

      updateFilterLooks($this);
      updatePageBkg(filterStr);
      setFilter(filterStr);

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
    bindFilterBtns();
  };

return {
    initPage : initPage
  }
})();

$(function() {
  YTK.apiPlay.initPage();
});