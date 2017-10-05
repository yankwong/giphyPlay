//TODO: add secret parameter to query URL
var YTK = YTK || {};

YTK.apiPlay = (function() {
  var 
  topics = ['cat', 'dog'],
  giphyKey = 'gDuZhVfBtBZJTRApZL2OqJ49bxEOrN2W',
  giphyURL = 'https://api.giphy.com/v1/gifs/search',
  filterStr = '',
  outputTotals = 0,
  ratingStr = 'g',
  putQuery = function(url) {
    $('.api-url').html('<b>For Nerds: </b>' + url);
  },
  makeQuery = function(apiURL, paramObj) {
    var url = apiURL + '?' + $.param(paramObj);
    putQuery(url);
    return url;
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
  getRarity = function(rating) {
    var retVal;

    if (rating == 'g') {
      retVal = 'common';
    }
    else if (rating == 'pg') {
      retVal = 'uncommon';
    }
    else {
      retVal = 'rare';
    }
    return retVal;
  },
  makeCard = function(rating, imgObj) {
    if (rating != ratingStr) return;

    var 
    rarity = getRarity(rating),
    $resultDiv = $('<div/>', {
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
    $imgDiv     = $('<div class="row image"><img class="' + rarity +'" src="' + imgObj.still + '">');

    outputTotals++;
    $resultDiv.append($ratingDiv);
    $resultDiv.append($imgDiv);

    $('.images-row', '.pictures').append($resultDiv);
  },
  putResults = function(results) {
    clearResults();
    outputTotals = 0;
    $.each(results, function(index, result) {
      makeCard(result.rating, getImgObj(result.images));
    });

    // the query turns up with 0 results (might be due to filters)
    if (outputTotals == 0) {
      var noResults = $('<div class="alert alert-danger" role="alert"><strong>Heads up!</strong> No Results found. Try changing the filter/rating/keyword.</div>');
      $('.images-row', '.pictures').append(noResults);
    }
  },
  makeBtn = function(apiURL, topicStr) {
    return $('<button/>', {
      text: topicStr,
      class: 'btn btn-success',
      click: function() {
        callAPI(makeQuery(giphyURL, {api_key : giphyKey, rating : ratingStr, q : (filterStr + ' ' + topicStr).trim(), limit : 10}),
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
  updateRatingLooks = function($activeBtn) {
    var $ratingBtns = $('.btn', '.rating-btns');

    $ratingBtns.removeClass('btn-primary');
    $ratingBtns.addClass('btn-outline-primary');
    $activeBtn.removeClass('btn-outline-primary');
    $activeBtn.addClass('btn-primary');
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
  setRating = function(rating) {
    ratingStr = rating;
  },
  bindRatingBtns = function() {
    var $ratingBtns = $('.btn', '.rating-btns');

    $ratingBtns.on('click', function() {
      var $this = $(this),
          rating = $this.attr('data-filter');
      updateRatingLooks($this);
      setRating(rating);
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
    bindRatingBtns();
  };

return {
    initPage : initPage
  }
})();

$(function() {
  YTK.apiPlay.initPage();
});