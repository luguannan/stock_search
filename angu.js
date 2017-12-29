angular
    .module('MdAutocompleteBugApp', ['ngMaterial','ngAnimate','ngMessages'])
    .controller('MdAutocompleteBugController', function($scope, $q, $timeout,$http) {
        var vm = this;
        vm.current = true;
        vm.favorites = [];
        if(localStorage.length > 0){
            for (var k= 0; k < localStorage.length;k++){
                vm.favorites.push(JSON.parse(localStorage.getItem(localStorage.key(k))));
            }
        }

        var URL='';
        function getChartAsPng(Chart){
                        var data = {
                options: JSON.stringify(Chart),
                filename: 'filename',
                type: 'image/png',
                async: true
            };

            var exportUrl = 'http://export.highcharts.com/';
            $.post(exportUrl, data, function(data) {
                var url = exportUrl + data;
                URL = url;

            });   
  
              
        }



        console.log(vm.favorites);
        $scope.change2 = function(sym){
            if(sym == '' || sym == undefined) {
                console.log('sym = ');
                $scope.validate_error = true;
            }
            else{
                $scope.validate_error = false;
                $scope.getQuote(sym);
                console.log(vm.current);
                vm.current = false;
                vm.draw_chart(sym,"SMA"); 
                vm.draw_chart(sym,"EMA"); 
                
                setTimeout(function(){
                    vm.draw_chart(sym,"STOCH")},0); 
                setTimeout(function(){
                    vm.draw_chart(sym,"MACD")},0); 
                setTimeout(function(){
                    vm.draw_chart(sym,"CCI")},00);
                setTimeout(function(){
                    vm.draw_chart(sym,"RSI")},0);
                setTimeout(function(){
                   vm.draw_chart(sym,"ADX")},0);
                setTimeout(function(){
                    vm.draw_chart(sym,"BBANDS")},0);
            }

    }
        $scope.change1 = function(sym){
            
            console.log(vm.current);
            //if(vm.current == false){
                $scope.getQuote(sym);
            //}

            vm.current = !vm.current;


    }



        $scope.clear = function() {
          $scope.selectedItem = null;
          $scope.searchText = "";
          
        }

        this.getMatches = function(searchText) {
            
            var deferred = $q.defer();

            $http.get('./market.json',{params:{input:searchText}}).success(function (data) {

                //console.log(data);
                deferred.resolve(data);
 
            }).error(function(data) {
                //console.log('Error: ' + data);
                //todo
            });
        return deferred.promise;

    }

        $scope.getQuote = function(j_symbol){
            var prefix = "#price_chart > "

            
            var symbol = j_symbol["Symbol"];

            $(prefix+".alert_chart").css("display","none");
            $(prefix+".c").css("display","none");
            $(prefix+".progress_chart").css("display","block");

            $http.get('./stock.json',{params:{input:symbol}}).success(function (data) {

            $(prefix+".alert_chart").css("display","none");
            $( prefix+ ".progress_chart").css("display","none");
            $(prefix+".c").css("display","block");



                var list_data = data["Time Series (Daily)"];
                var time_list = new Array();
                for (var days in list_data){
                    time_list.push(days);
                }
                
                var change = list_data[time_list[0]]["4. close"]-list_data[time_list[1]]["4. close"];
                var changep = Number(change/list_data[time_list[1]]["4. close"]*100).toFixed(2);
                var table_head = '<div id="current_stock_left" class=" col-md-12 table-responsive"><table class = "table table-striped">'
                +'<tr><td><b>Stock Ticker Symbol</b></td><td>'+symbol+'</td></tr>'
                +'<tr><td><b>Last Price</b></td><td>'+Number(list_data[time_list[0]]["4. close"]).toFixed(2)+'</td></tr>'
                +'<tr><td><b>Change(Change Percent)</b></td>';

                if(change>0){
                    var row_change = '<td style ="color:green;" >'+ Number(change).toFixed(2)+'('+changep+'%)' + '<img src = "http://cs-server.usc.edu:45678/hw/hw8/images/Up.png" width="16px" height = "16px">';

                }else if(change<0){
                     var row_change = '<td style ="color:red;" >'+ Number(change).toFixed(2)+'('+changep+'%)' + '<img src = "http://cs-server.usc.edu:45678/hw/hw8/images/Down.png" width="16px" height = "16px">';

                }else{
                     var row_change = '<td>'+ Number(change).toFixed(2)+'('+changep+'%)';
                }

                var t = data["Meta Data"]["3. Last Refreshed"];
                if (t.length<11) {
                    t = data["Meta Data"]["3. Last Refreshed"]+' 16:00:00';
                } 
              
                var b = '</td></tr><tr><td><b>Timestamp</b></td><td>'+t+' EST</td></tr>'+
                '<tr><td><b>Open</b></td><td>'+Number(list_data[time_list[0]]["1. open"]).toFixed(2)+'</td></tr>'+
                '<tr><td><b>Previous Close</b></td><td>'+Number(list_data[time_list[0]]["4. close"]).toFixed(2)+'</td></tr>'+
                '<tr><td><b>Day\'s Range</b></td><td>'+Number(list_data[time_list[0]]["3. low"]).toFixed(2)+'-'+Number(list_data[time_list[0]]["2. high"]).toFixed(2)+'</td></tr>'+
                '<tr><td><b>Volume</b></td><td>'+Number(list_data[time_list[0]]["5. volume"]).toLocaleString("en-US")+'</td></tr></table></div></div>';


                $("#current_stock").empty();
                $("#current_stock").append(table_head+row_change+b);

                $('.nav-tabs a:first').tab('show') 


                draw_price(symbol,data);
                 //var ccp =  ''+Number(change).toFixed(2)+'('+changep+'%)'; 
                vm.currentItem = {
                    Symbol: symbol,
                    Price: Number(list_data[time_list[0]]["4. close"]),
                    Change: Number(change),

                    ChangeP: Number(changep),
                    Volume:Number(list_data[time_list[0]]["5. volume"]),
                    Time:Date.parse(new Date()),
                };
                console.log(vm.currentItem);

                for(var k in vm.favorites ){
                    //console.log(k);
                    if (vm.currentItem.Symbol==vm.favorites[k].Symbol){
                        if ($("#star").hasClass("glyphicon-star-empty")){
                            $("#star").addClass("glyphicon-star");
                            $("#star").addClass("favor");
                            $("#star").removeClass("glyphicon-star-empty");
                            //console.log("yes");
                        }
                    }



                }



     
                }).error(function(data) {
                    
                    $(prefix+".alert_chart").css("dispaly","block");
                    $(prefix+".progress_chart").css("dispaly","none");
                    $(prefix+".c").css("dispaly","none");
           
                    //todo

                });


        }




        function draw_price(symbol,j_symbol){

            console.log(symbol);
            console.log(j_symbol);
            var datekeys = new Array();
                for ( var k in j_symbol['Time Series (Daily)']){
                    datekeys.push(k);
                }
                //console.log(datekeys);
                var times = new Array();
                var datas=new Array();
                var datasV=new Array();
                var tt = symbol+' Stock Price and Volume';
                //var SeriesName = 'Stock Price';
                for(var i = 0; i<133;i++){
                    var x = "";
                    //console.log(j_symbol['Time Series (Daily)'][datekeys[i]]);
                    datas.push(parseFloat(j_symbol['Time Series (Daily)'][datekeys[i]]['1. open']));
                    datasV.push(parseFloat(j_symbol['Time Series (Daily)'][datekeys[i]]['5. volume']));
                    x = datekeys[i].substring(5,7)+"/"+datekeys[i].substring(8,10);
                    times.push(x);
                    
                }
   

                var Chart = Highcharts.chart("price_c", {
                        title: {
                            text: tt
                        },
                        subtitle: {
                            text: '<a href="https://www.alphavantage.co/">Source: Alpha Vantage</a>'
                        },
                        xAxis: {
                            categories: times,
                            reversed: true,
                            tickInterval: 15,
                            showLastLabel: true,
                        },
                        yAxis: [{
                            type: 'linear',
                            tickAmount: 4,
                            title: {
                                text: 'Stock Price'
                            },
                            },{
                            title: {
                                text: 'Volume'
                            },
                            tickAmount: 4,
                            opposite:true,
                            
                        },],
 
                            plotOptions: {
                                area: {
                                    fillColor: 'rgb(227,226,254)',
                                    marker: {
                                        enabled: false,
                                        radius: 2,
                                        fillColor: 'rgb(0,0,255)',
                                    },
                                    lineWidth: 2,
                                    lineColor: 'rgb(0,0,255)',
                                    threshold: null
                                }
                            },

                            

                            series: [{
                                type:'area',
                                name: 'Stock Price',
                                yAxis: 0,
                                color: 'rgb(0,0,255)',
                                data: datas
                            },{
                                type:'column',                                   
                                name: 'Volume',
                                yAxis: 1,
                                color: 'rgb(233,33,0)',
                                data: datasV
                            }],

                    });
                getChartAsPng(Chart);




        }



    $scope.draw_priceVolume = function (selected){
        var symbol = selected["Symbol"];
        $http.get('./stock.json',{params:{input:symbol}}).success(function (data) {

            draw_price(symbol,data)

        }).error(function(data) {

        });


    }





    $scope.draw_news = function(selected){
        //$("cur_stock").empty();
        var symbol = selected["Symbol"];
        $http.get('./news.json',{params:{input:symbol}}).success(function (j_symbol) {



            var news_l = j_symbol.rss.channel[0]['item'];
           // console.log(news_l.length);
           // console.log(news_l);
            var news_list = new Array();
            for (var i = 0; i <news_l.length; i++) {
               // console.log('ss');
                //console.log(news_list[i]);
                //console.log(news_list[i]["link"]);
               // console.log("aa");
                if (news_l[i]["link"][0].indexOf("article")>0){
                    console.log(news_l[i]["link"][0]);
                    //news_list.push(news_l[i]);
                    news_list.push(news_l[i]);
                }
                
            }
            console.log(news_list);
                    //sort article according to time
            news_list.sort(function(a,b){
                var t = new Date(a.pubDate);
                var tmp = new Date(b.pubDate);
                return tmp-t;

            });
            $("#news").empty();
            if (news_list.length>=5){
                for (var i = 0;i<5;i++) {
                    news_html = '<div class = "well" style = "margin-top:15px;margin-bottom:15px;margin-left:5px;margin-right:5px;backgroung-color: rgb(232,232,232);"><h4><a href ='+news_list[i]["link"][0]+' target="_blank">'+news_list[i]["title"][0]+'</a><br><br>'
                    +'<p>Author: '+news_list[i]["sa:author_name"][0]+'</p><p>Date: '+ news_list[i]["pubDate"][0].substring(0,news_list[i]["pubDate"][0].length-5)+' EST</div>';
                    news_h = '<div>ssssssss</div>';
                    //console.log(i);
                    
                    $("#news").append(news_html);
                }
                
            }else{
                    for (var i = 0;i<news_list.length;i++) {
                    news_html = '<div class = "well" style = "margin-top:15px;margin-bottom:15px;margin-left:5px;margin-right:5px;backgroung-color: rgb(232,232,232);"><h4><a href ='+news_list[i]["link"][0]+' target="_blank">'+news_list[i]["title"][0]+'</a><br><br>'
                    +'<p>Author: '+news_list[i]["sa:author_name"][0]+'</p><p>Date: '+ news_list[i]["pubDate"][0].substring(0,news_list[i]["pubDate"][0].length-5)+' EST</div>';
                    
                    $("#news").append(news_html);
                }
                

            }







        }).error(function(data) {


                //console.log('Error: ' + data);
                //todo
        });
             
    }

    $scope.draw_his = function(selected){
        //$("current_stock").empty();
        
        var symbol = selected["Symbol"];
        $http.get('./stock.json',{params:{input:symbol}}).success(function (j_symbol) {
        var datekeys = new Array();
        for ( var k in j_symbol['Time Series (Daily)']){
            datekeys.push(k);
        }
                
        var times = new Array();
        var datas=new Array();
        var tt = symbol+' Stock Price';
        //var SeriesName = 'Stock Price';
        for(var i = 0; i<datekeys.length;i++){
            //var x = "";
            //console.log(j_symbol['Time Series (Daily)'][datekeys[i]]);
                    

            dat = Date.UTC(datekeys[i].split("-")[0],datekeys[i].split("-")[1]-1,datekeys[i].split("-")[2],0,0,0,0);
            times.push(dat);
/*
            var points = [
            dat,
            parseFloat(j_symbol['Time Series (Daily)'][datekeys[i]]['1. open'])
            ]
            datas.push(points);
*/                    
            datas.push([dat,parseFloat(j_symbol['Time Series (Daily)'][datekeys[i]]['4. close'])]);
            if (i == 1001)break;

        }
        console.log(datas);

        //$("#his_chart").empty();
        var chart = Highcharts.stockChart( 'his_chart', {


           
            rangeSelector : {
                buttons : [{
                type : 'day',
                count : 7,
                text : '1w'
            }, {
                type : 'month',
                count : 1,
                text : '1m'
            }, {
                type : 'month',
                count : 3,
                text : '3m'
            }, {
                type : 'month',
                count : 6,
                text : '6m'
            },  {
                type: 'ytd',
                text: 'YTD'
            }, {
                type : 'year',
                count : 1,
                text : '1y'
            },  {
                type : 'all',
                count : 1,
                text : 'All'
            }],
            selected : 0,
            
        },

        title : {
            text : symbol+' Stock Price'
        },
        subtitle: {
            text: '<a href=\"https://www.alphavantage.co/\"  target=\"_blank\">Source: Alpha Vantage</a>',
                    },
        yAxis: {
            title: {
                text: 'Stock Value',
                align: 'middle',
                textAlign: 'left'
            }
        },

        series : [{
            name : symbol+' Stock Price',
            data : datas.reverse(),
            type : 'area',
            threshold : null,
            tooltip : {
                valueDecimals : 2,
                valuePrefix: "$"
            },
   
            
        }]
    });





    }).error(function(data) {


                
        });
    }














    $scope.share_fb = function(){

                    FB.ui({
                method: 'feed',
                picture: URL, 
                 
                }, function(response){
                if (response && !response.error_message) {
                    alert("Posted successfully");
                } else {
                    alert("Not posted");
                }
            }); 


    }

    $scope.remove_fav = function(fav){

        localStorage.removeItem(fav.Symbol);
            vm.favorites = [];

            if(localStorage.length > 0){
            for (var k= 0; k < localStorage.length;k++){
                vm.favorites.push(JSON.parse(localStorage.getItem(localStorage.key(k))));
            }
        }
            $("#star").addClass("glyphicon-star-empty");

            $("#star").removeClass("favor");
            $("#star").removeClass("glyphicon-star");


       // refresh();
       // var x="#"+symbol;
       // $(x).remove();
    }

    $scope.fav_star_fun = function(){
        console.log(vm.currentItem);
        
        //console.log(selected);
        //var symbol = selected["Symbol"];

        /*
        if(localStorage.getItem(symbol)){


        }else{
 
            $("#fav_star").css("color","gold");
            $("#star").removeClass("glyphicon-star-empty").addClass("glyphicon-star");

        }

*/
        if ($("#star").hasClass("favor")) {
            $("#star").addClass("glyphicon-star-empty");

            $("#star").removeClass("favor");
            $("#star").removeClass("glyphicon-star");

            localStorage.removeItem(vm.currentItem.Symbol);
            //vm.favorites.
            //var x="#"+symbol;
            //$(x).remove();
            vm.favorites = [];
            if(localStorage.length > 0){
            for (var k= 0; k < localStorage.length;k++){
                vm.favorites.push(JSON.parse(localStorage.getItem(localStorage.key(k))));
            }
        }

        }else{
            //vm.favorites.push(vm.currentItem);
            console.log(vm.favorites.Symbol);
            $("#star").addClass("glyphicon-star");
            $("#star").addClass("favor");
            $("#star").removeClass("glyphicon-star-empty");
            localStorage.setItem(vm.currentItem.Symbol,JSON.stringify(vm.currentItem));
            vm.favorites = [];

            if(localStorage.length > 0){
            for (var k= 0; k < localStorage.length;k++){
                vm.favorites.push(JSON.parse(localStorage.getItem(localStorage.key(k))));
            }
        }

        }
       

    }
    
    
    
    function process_fav(symbol){
         if ($("#star").hasClass("fav")) {
            $("#star").addClass("glyphicon-star-empty");

            $("#star").removeClass("fav");
            $("#star").removeClass("glyphicon-star");

            localStorage.removeItem(symbol);
                    if(localStorage.length > 0){
            for (var k= 0; k < localStorage.length;k++){
                vm.favorites.push(JSON.parse(localStorage.getItem(localStorage.key(k))));
            }
        }
            //var x="#"+symbol;
            $(x).remove();

        }else{
            $("#star").addClass("glyphicon-star");
            $("#star").addClass("fav");
            $("#star").removeClass("glyphicon-star-empty");




            localStorage.setItem(symbol,JSON.stringify(addRow));

            console.log(addRow["Change"]);


        }
    }





    $scope.refresh = function(){
        //vm.favorites = [];
        vm.temp = [];
        if(vm.favorites.length > 0){
            for (var k= 0; k < vm.favorites.length;k++){
                vm.temp.push(vm.favorites[k]["Symbol"]);
                //console.log(localStorage[k]);
                console.log(vm.favorites[k]);
            }
        }
        vm.favorites = [];
        console.log(vm.temp);

        if(vm.temp.length > 0){

            for (var k in vm.temp){
                console.log(vm.temp[k]);
                 var symbol =  vm.temp[k];
                $http.get('./stock.json',{params:{input:symbol}}).success(function (data) {
               
                console.log(data);


                var list_data = data["Time Series (Daily)"];
                var time_list = new Array();
                for (var days in list_data){
                    time_list.push(days);
                }
 
                var change = list_data[time_list[0]]["4. close"]-list_data[time_list[1]]["4. close"];
                var changep = Number(change/list_data[time_list[1]]["4. close"]*100).toFixed(2);
               

                vm.newItem = {
                    Symbol: symbol,
                    Price: Number(list_data[time_list[0]]["4. close"]),
                    Change: Number(change),
                    //ChangePercent:ccp,
                    //ChangePercent: '('+changep+'%)',
                    ChangeP: Number(changep),
                    Volume:Number(list_data[time_list[0]]["5. volume"]),
                    Time:Date.parse(new Date()),
                };
                localStorage.removeItem(symbol);

                localStorage.setItem(symbol,JSON.stringify(vm.newItem));

                vm.favorites.push(JSON.parse(localStorage.getItem(symbol)));

                //console.log(vm.favorites);
  
                }).error(function(data) {
                    console.log('Error: ' + data);
                    //todo
                });
                //vm.favorites.push(JSON.parse(localStorage.getItem(localStorage.key(k))));
            }
        }
    }











    vm.draw_chart = function(selected,indi){

        var symbol = selected["Symbol"];

            var prefix = "#"+indi.toLowerCase()+"_chart > ";
        //console.log("ssss");
            $(prefix+".alert_chart").css("display","none");
            $(prefix+".c").css("display","none");
            $(prefix+".progress_chart").css("display","block");


        $http.get('./chart.json',{params:{input:symbol,indicator:indi}}).success(function (data) {
            $(prefix+".alert_chart").css("display","none");
            $( prefix+ ".progress_chart").css("display","none");
            $(prefix+".c").css("display","block");

           
            var datekeys = new Array();
            var times = new Array();
            var datas = new Array();
            var t = "Technical Analysis: "+indi;
            for(var k in data[t]){
                datekeys.push(k);
            }

            for(var i = 0; i < Math.min(133, datekeys.length);i++){
                var d = "";
                d = datekeys[i].substring(5,7)+"/"+datekeys[i].substring(8,10);
                times.push(d);
            }


try {

            if (indi == "STOCH") {
                var tl = 'Stochastic Oscillator (STOCH)';
                var a = symbol +' SlowK';
                var Interval = 10;
                var datasD=new Array();
                for (var i=0;i<133;i++){
                    datas.push(parseFloat(data[t][datekeys[i]]["SlowK"]));
                    datasD.push(parseFloat(data[t][datekeys[i]]["SlowD"]));
                }

                var Chart =    Highcharts.chart('stoch_c', {
                    title: {
                        text: tl
                    },
                    subtitle: {
                        text: '<a href=\"https://www.alphavantage.co/\" target=\"_blank\">Source: Alpha Vantage</a>'
                    },
                    xAxis: {
                        categories: times,
                        reversed: true,
                        tickInterval: 5,
                    },
                    yAxis: {
                        title: {
                            text: indi
                        },
                        tickInterval: Interval,
                    },

                    plotOptions: {
                        line:{
                            marker: {//dot
                                enabled:false,
                                radius: 2,
                                symbol:  'square'
                            },
                            lineWidth: 1,
                          },  
                    },
                    series: [{
                        name: a,
                        data: datas,
                        color: 'rgb(233,33,0)',

                    },{
                    name: symbol + ' SlowD',
                    data: datasD,

                },
                    ],

                });
                getChartAsPng(Chart);

                //Chart.addSeries();


            } 
            else if(indi == "BBANDS"){
                var tl = data["Meta Data"]["2: Indicator"];
                var a = symbol +' Real Middle Band';
                var Interval = 5;
                var datasU=new Array();
                var datasL=new Array();
                for (var i=0;i<133;i++){
                    datas.push(parseFloat(data[t][datekeys[i]]["Real Middle Band"]));
                    datasU.push(parseFloat(data[t][datekeys[i]]["Real Upper Band"]));
                    datasL.push(parseFloat(data[t][datekeys[i]]["Real Lower Band"]));
                }

                var Chart =    Highcharts.chart('bbands_c', {
                    title: {
                        text: tl
                    },
                    subtitle: {
                        text: '<a href=\"https://www.alphavantage.co/\" target=\"_blank\">Source: Alpha Vantage</a>'
                    },
                    xAxis: {
                        categories: times,
                        reversed: true,
                        tickInterval: 5,
                    },
                    yAxis: {
                        title: {
                            text: indi
                        },
                        tickInterval: Interval,
                    },

                    plotOptions: {
                        line:{
                            marker: {//dot
                                enabled:false,
                                radius: 2,
                                symbol:  'square'
                            },
                            lineWidth: 1,
                          },  
                    },
                    series: [{
                        name: a,
                        data: datas,
                        color: 'rgb(233,33,0)',

                    },{
                    name: symbol + ' Real Upper Band',
                    data: datasU,

                },{
                    name: symbol + ' Real Lower Band',
                    data: datasL,

                }
                ],

                });

                getChartAsPng(Chart);

                    //Chart.addSeries();
               // Chart.addSeries();

            }else if (indi == "MACD"){
                var tl = data["Meta Data"]["2: Indicator"];
                var a = symbol +' MACD';
                var Interval = 1;
                var datasH=new Array();
                var datasS=new Array();
                for (var i=0;i<133;i++){
                    datas.push(parseFloat(data[t][datekeys[i]]["MACD"]));
                    datasH.push(parseFloat(data[t][datekeys[i]]["MACD_Signal"]));
                    datasS.push(parseFloat(data[t][datekeys[i]]["MACD_Hist"]));
                }

                            var Chart =    Highcharts.chart('macd_c', {
                    title: {
                        text: tl
                    },
                    subtitle: {
                        text: '<a href=\"https://www.alphavantage.co/\" target=\"_blank\">Source: Alpha Vantage</a>'
                    },
                    xAxis: {
                        categories: times,
                        reversed: true,
                        tickInterval: 5,
                    },
                    yAxis: {
                        title: {
                            text: indi
                        },
                        tickInterval: Interval,
                    },

                    plotOptions: {
                        line:{
                            marker: {//dot
                                enabled:false,
                                radius: 2,
                                symbol:  'square'
                            },
                            lineWidth: 1,
                          },  
                    },
                    series: [{
                        name: a,
                        data: datas,
                        color: 'rgb(233,33,0)',

                    },{
                    name: symbol + ' MACD_Hist',
                    data: datasH,

                },{
                    name: symbol + ' MACD_Signal',
                    data: datasS,

                }],

                });

                            getChartAsPng(Chart);
                  //  Chart.addSeries();
                //Chart.addSeries();



            }else {
                if(indi == "SMA") var indica = "sma_c";
                if(indi == "EMA") var indica = "ema_c";
                if(indi == "RSI") var indica = "rsi_c";
                if(indi == "ADX") var indica = "adx_c";
                if(indi == "CCI") var indica = "cci_c";
                //if(indi == "RSI") var indica = "rsi_c";

                var aa = symbol;
                console.log(data);
                var tl = data["Meta Data"]["2: Indicator"];
                for (var i=0;i<133;i++){
                    datas.push(parseFloat(data[t][datekeys[i]][indi]));
                }
                
                var Chart =    Highcharts.chart(indica, {
                    title: {
                        text: tl
                    },
                    subtitle: {
                        text: '<a href=\"https://www.alphavantage.co/\" target=\"_blank\">Source: Alpha Vantage</a>'
                    },
                    xAxis: {
                        categories: times,
                        reversed: true,
                        tickInterval: 5,
                    },
                    yAxis: {
                        title: {
                            text: indi
                        },
                        tickInterval: Interval,
                    },

                    plotOptions: {
                        line:{
                            marker: {//dot
                                enabled:false,
                                radius: 2,
                                symbol:  'square'
                            },
                            lineWidth: 1,
                          },  
                    },
                    series: [{
                        name: aa,
                        data: datas,
                        color: 'rgb(233,33,0)',

                    }],

                });
                getChartAsPng(Chart);
            }


            //console.log('aa');
            
 } catch (e) {
    console.log(e);
            $(prefix+".alert_chart").css("dispaly","block");
            $(prefix+".progress_chart").css("dispaly","none");
            $(prefix+".c").css("dispaly","none");
           
 }
        }).error(function(data) {

            $(prefix+".alert_chart").css("dispaly","block");
            $(prefix+".progress_chart").css("dispaly","none");
            $(prefix+".c").css("dispaly","none");
           


                //console.log('Error: ' + data);
                //todo
        });









      



    }















});
