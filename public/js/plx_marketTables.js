



function exactRound(num, decimals) {
    if (decimals < 0) decimals = 0;
    var sign = num >= 0 ? 1 : -1;
    return (Math.round((num * Math.pow(10, decimals)) + (sign * 0.001)) / Math.pow(10, decimals)).toFixed(decimals);
}

function getName(coin) {
    return currencyNamesArray[coin];
}

function formatTickerData(pair, tickerData) {
    // console.log('format ' + pair + ' : ',tickerData);
    var pairArray = pair.split("_"),
    	base = pairArray[0],
    	quote = pairArray[1],
        name = getName(quote),
        decimals;


    tickerData.url = pair.toLowerCase();
    tickerData.pair = pair;
    tickerData.primary = base;
    tickerData.secondary = quote;
    tickerData.symbol = quote;
    tickerData.balance = 0.0;
    tickerData.value = 0.0;

    //if (allBalances instanceof Object) {
    //    tickerData.balance = parseFloat(allBalances['balances'][quote]) + parseFloat(allBalances['onOrders'][quote]);
    //    tickerData.value = tickerData.balance * parseFloat(tickerData.highestBid);
    //}

    tickerData.balance = tickerData.balance.toFixed(4);
    tickerData.value = tickerData.value.toFixed(4);

    allTickerData[pair]['balance'] = tickerData.balance;
    allTickerData[pair]['value'] = tickerData.value;

    tickerData.price = tickerData.last;

    tickerData.volume = exactRound(tickerData.baseVolume, 3);
    tickerData.change = exactRound(tickerData.percentChange * 100, 2);
    tickerData.changeDirection = "positive";
    tickerData.displayChange = tickerData.change;
    tickerData.name = "";
    tickerData.class = "";

    if (name) {
        tickerData.name = name;
    }

    tickerData.frozen = '';
    if (tickerData.isFrozen === '1') {
        tickerData.frozen = 'frozen';
    }

    if (tickerData.change < 0) {
        tickerData.changeDirection = "neg";
    }
    else {
        tickerData.displayChange = '+' + tickerData.displayChange;
    }

    return tickerData;
}

function getRow(pair) {
    var d = formatTickerData(pair, allTickerData[pair]);
    var active = '';
    var starOff = '';
    var starContents = '~';
    var pair = (primaryCurrency + '_' + secondaryCurrency).toLowerCase();
    if (d.url == pair) { active = ' active'; }

    // if this is marked as non-starred in settings
    var starIndex = starSettings.indexOf(d.url.toUpperCase());
    if (starIndex > -1) {
        starOff = ' starOff';
        starContents = '';
    }

    var row = '<tr  data-url="' + d.url + '" id="marketRow' + d.url + '" class="marketRow ' + d.frozen + active + starOff + '">';
    row += '<td class="star"><input class="auto" type="checkbox" name="' + d.url + '" /></td>';
    row += '<td class="coin">' + d.secondary + '</td>';
    if (!d.frozen) {
        row += '<td class="pricechange"><p class="price">' + d.price + '</p></td>'; //<p class="change">' + d.displayChange + '</p>
        row += '<td class="volume">' + d.volume + '</td>';
        row += '<td class="change ' + d.changeDirection + '">' + d.displayChange + '</td>';
    } else {
        row += '<td class="price">&nbsp;FROZEN</td>'; // nbsp is used to make FROZEN appear last in sorting order
        row += '<td class="volume"></td>';
        row += '<td class="change"></td>';
    };
    row += '<td class="balances" > - </td>';
    row += '<td class="thVolume"><p class="thBuy"> ' + '-'
                + ' </p> <p class="thSell">' + '-' + '</p></td>';
    row += '<td class="thproloss"><p class="profit">Profit <input type="text" value = "1" /></p> <p class="stoploss">Stop Loss <input type="text" value = "1" /></p></td>';
    row += '<td class="bet"><p>Min <input type="text" value = "1" /></p> <p>Max <input type="text" value = "100" /></p></td>';
    row += '<td ><ul class="tbMa"><li><span class="_300">-</span><input type="checkbox" /></li>'+'<li><span class="_900">-</span><input type="checkbox" /></li>'
                        +'<li><span class="_1800">-</span><input type="checkbox" /></li>'+'<li><span class="_7200">-</span><input type="checkbox" /></li>'
                        +'<li><span class="_14400">-</span><input type="checkbox" /></li><li><span class="_86400">-</span><input type="checkbox" /></li></ul> </td>';
    
    row += '</tr>';

    return row;
}

function writeMarketTable(coin) {
    var arr = currencyPairArray.filter(function (d, i) {
        return (d.substr(0, coin.length) === coin);
    });

    var rows = '';
    for (var i = 0; i < arr.length; i++) {
        rows += getRow(arr[i]);
    }

    $('#market' + coin + ' tbody').html(rows);
}

function clearMarketSearch() {
    $('#marketSearch').val("");
    $('#marketSearch').removeClass('x onX');
    $('#marketBTC').DataTable().search('').draw();
    $('#marketETH').DataTable().search('').draw();
    $('#marketXMR').DataTable().search('').draw();
    $('#marketUSDT').DataTable().search('').draw();
    setFilterMessage();

}

function setFilterMessage() {
    if ($('#marketStar').is(":checked") || $('#marketSearch').val()) {
        $('#marketTables').addClass('filtered');
    } else {
        $('#marketTables').removeClass('filtered');
    }
    //$(".dataTables_length").hide();
    //$(".dataTables_filter").hide();
    //$(".dataTables_info").hide();
}


function filterNonStarred() {
    var fString;
    if ($('#marketStar').is(":checked")) {
        fString = '~';
    } else {
        fString = '';
    }
    $('#marketBTC').dataTable().fnFilter(fString, 0);
    $('#marketETH').dataTable().fnFilter(fString, 0);
    $('#marketXMR').dataTable().fnFilter(fString, 0);
    $('#marketUSDT').dataTable().fnFilter(fString, 0);
    setFilterMessage();
}

function showMarketLines(rows) {
    var rowHeight = 21;
    var targetHeight = 0;
    var section = $('#marketTables section.active');
    var dt = section.find('.dataTables_scrollBody');
    var jsp = dt.find('.jspContainer');
    var tbl = jsp.find('.dataTable');
    var tableHeight = tbl.height();

    if (rows === 'ALL') {
        // show all
        targetHeight = tableHeight;
    } else {
        if ((rows * rowHeight) >= tableHeight) {
            // the table is shorter than the default height, collapse
            targetHeight = tableHeight;
        } else {
            // the table is larger than the default height, fixed
            targetHeight = (rows * rowHeight);
        }
    }

    // reset datatables scrollY val
    var dtObj = tbl.dataTable();
    dtObj.fnSettings().oScroll.sY = targetHeight;
    dtObj.fnDraw(false); // false = do not resort/filter before redraw

    dt.stop().css({ height: targetHeight });
    jsp.stop().css({ height: targetHeight });
    dt.data('jsp').reinitialise(); //reinit scrollbars
}

function resetMatketTableHeights() {
    //var localEX = localStorage["exchangeSettings"];
    //var settings = JSON.parse(localEX);

    //if (typeof (settings.marketRows) != 'undefined') {
    //    showMarketLines(settings.marketRows);
    //} else {
    //    $('#rowButtons .active').click();
    //}

    //showMarketLines(20);

    //$('#rowButtons .active').click();
    $(".dataTables_filter").hide();
    //$(".dataTables_scrollHeadInner").css("width", "100%");
    //$("table.dataTable").css("width", "100%");
    $("#marketRowbtc_eth").removeClass("active");
    
}

function InitDataTable() {
    var marketTablesLoaded = 0;
    var marketTableOptions = {
        paging: false,
        autoWidth: false,
        info: false,
        //use datatables built in local storage function to save sort order and other table settings
        stateSave: true,
        scrollY: 800,
        scrollCollapse: true,
        order: [[3, 'desc']],
        language: { "emptyTable": "No markets to display", "zeroRecords": "No markets matching your filters" },
        // Set the sort on some columns to be descending on first click
        // If we add a new col to the table it needs to be defined here
        aoColumns: [
			{ "asSorting": ["desc", "asc"] },
			{ "visible": true },
			{ "asSorting": ["desc", "asc"], "searchable": false },
			{ "asSorting": ["desc", "asc"], "searchable": false, "visible": true },
			{ "asSorting": ["desc", "asc"], "searchable": false },
			{ "visible": true },
			{ "asSorting": ["desc", "asc"], "searchable": false, "visible": true },
			{ "asSorting": ["desc", "asc"], "searchable": false, "visible": true },
            { "visible": true },
            { "bSortable" : false,"visible": true }
        ],
        fnInitComplete: function (oSettings, json) {
            marketTablesLoaded++;
        }
    };

    marketBTCTable = $('#marketBTC').dataTable(marketTableOptions);
    marketETHTable = $('#marketETH').dataTable(marketTableOptions);
    marketXMRTable = $('#marketXMR').dataTable(marketTableOptions);
    marketUSDTTable = $('#marketUSDT').dataTable(marketTableOptions);

    //Prevent Datatables from saving the search filter settings to local storage
    marketBTCTable.dataTable()
		.on('stateSaveParams.dt', function (e, settings, data) {
		    data.search.search = "";
		});
    marketETHTable.dataTable()
		.on('stateSaveParams.dt', function (e, settings, data) {
		    data.search.search = "";
		});
    marketXMRTable.dataTable()
		.on('stateSaveParams.dt', function (e, settings, data) {
		    data.search.search = "";
		});
    marketUSDTTable.dataTable()
		.on('stateSaveParams.dt', function (e, settings, data) {
		    data.search.search = "";
		});

}

function InitTicker(){
    $.ajax({
        url: '/api/geturljson',
        data: {
            url: 'https://poloniex.com/public?command=returnTicker'
        },
        global: false,
        type: 'POST',
        async: false, //blocks window close
        success: function (result) {
            allTickerData = result.data;
            writeMarketTable('BTC');
            writeMarketTable('ETH');
            writeMarketTable('XMR');
            writeMarketTable('USDT');
            
            $('#containerBTC .dataTables_scrollHeadInner table thead tr th').eq(0).click();
            
            InitSettingData();
        }
    });
}





starSettings = [];
var allTickerData = {};
$(document).ready(function () {
    InitTicker();
    InitDataTable();
    InitBalances();
    // Tabbed Sections
    

    $('#marketTables .tabs li').on('click', function (e) {
        e.preventDefault();
        if (!$(this).hasClass('active')) {
            $('#marketTables .tabs').find('li').removeClass('active');
            $(this).addClass('active');

            $('#marketTables').find('.marketContainer').removeClass('active');
            var target = $(this).attr('data-url');
            $('#' + target).addClass('active');

            var pane = $('#' + target + ' .jspScrollable');
            var api = pane.data('jsp');
            if (api) { api.scrollToY(0); }

            $('#rowButtons .active').click();

            // canh lại header
            $('#' + target + ' .dataTables_scrollHeadInner table thead tr th').eq(8).click();

        }
        //var abc = $("#" + e.target.id).attr("data-url");
        //$("#" + abc).addClass("active");
    });


    resetMatketTableHeights();

    $("#marketsContainer .change").each(function(index, value) {
        var text = $(this).html();
        if (text.indexOf('-') != -1) {
            $(this).css("color", "red");
        }
        if (text.indexOf('+') != -1) {
            $(this).css("color", "green");
        }
    });

    // set up search to do all 3 markets
    $('#marketSearch').keyup(function (e) {
        var s = $(this).val();
        if (s != '' && s != null) {
            $('#marketBTC').DataTable().search(s).draw();
            $('#marketETH').DataTable().search(s).draw();
            $('#marketXMR').DataTable().search(s).draw();
            $('#marketUSDT').DataTable().search(s).draw();
            setFilterMessage();
        } else {
            clearMarketSearch();
        }
        
        resetMatketTableHeights();
        
    });

    // Magnifying glass icon click
    $('.search .icon').click(function () {
        $('#marketSearch').focus();
    });

    $('.autoselectall').change(function() {
        var name = $(this).attr("data-url");
        var list = $("#" + name).find(".dataTables_scrollBody").eq(0).find(".star input");
        if(this.checked) {
            list.prop('checked', true);
        }else{
            list.prop('checked', false);
        }
    });

    $('.thSetting').change(function() {
        settingData.thSetting = $(this).val();
        UpdateSettingData(settingData);
        refreshTH();
    });

    $('.maSetting').change(function() {
        settingData.maSetting =  $(this).val();
        UpdateSettingData(settingData);
        refreshMA();
    });

    $('.star input.auto').change(function(){
        var name = $(this).attr("name").toUpperCase();
        if(this.checked) {
            settingData[name].auto = true;
        }else{
            settingData[name].auto = false;
        }
        UpdateSettingData(settingData);
    })

    $('.tbMa input[type="checkbox"]').change(function(){
        var period = $(this).parent().find('span').eq(0).attr('class');
        var pair = $(this).closest(".marketRow").eq(0).attr('data-url').toUpperCase();
        if(this.checked) {
            settingData[pair][period] = true;
        }else{
            settingData[pair][period]  = false;
        }
        UpdateSettingData(settingData);
    });

    $('.marketRow .profit input').change(function(){
        var pair = $(this).closest('.marketRow').attr('data-url').toUpperCase();
        if($(this).val() == '' || parseFloat($(this).val()) <= 0){
            alert(pair , 'invalid profit');
            return ;
        }
        settingData[pair].profit = parseFloat($(this).val());
        UpdateSettingData(settingData);
    })

    $('.marketRow .stoploss input').change(function(){
        var pair = $(this).closest('.marketRow').attr('data-url').toUpperCase();
        if($(this).val() == '' || parseFloat($(this).val()) <= 0){
            alert(pair , 'invalid stoploss');
            return ;
        }
        settingData[pair].stoploss = parseFloat($(this).val());
        UpdateSettingData(settingData);
    })

});

$(document).bind('keyup', function (e) {
    // ESC to clear Filter
    if (e.keyCode == 27) {
        clearMarketSearch();
        resetMatketTableHeights();
    }
});
