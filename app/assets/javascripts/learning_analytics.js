var learningAnalytics = angular.module('learningAnalytics', ['ui.bootstrap']);

learningAnalytics.factory('utils', function() {
    var getPlayerLastDatasetResult = [];
    var getGameplayDatasetResult = [];
    var getPlayerFirstDatasetResult = [];
    var getPlayerDatasetResult = [];
    var utils = {
   
    getUsernameById: function (la, id) {
        for (var i = la.players.length - 1; i >= 0; i--) {
            if (la.players[i].idPlayer == id)
            {
                if (la.players[i].student != null)
                {
                    return la.players[i].student.username;
                }
                else
                {
                    if (la.players[i].name != null)
                    {
                        return la.players[i].name + ' (' + la.players[i].idPlayer + ')';      
                    }
                    else if (la.players[i].username != null)
                    {
                        return la.players[i].username + ' (' + la.players[i].idPlayer + ')';      
                    }
                    else if (la.players[i].firstname != null)
                    {
                        return la.players[i].firstname + ' (' + la.players[i].idPlayer + ')';      
                    }
                    return 'Anonymous ('+ la.players[i].idPlayer + ')';                 
                }
            }
        }
        return "No username found";
    },

    getGameplayDataset: function (la) {
        if (getGameplayDatasetResult.length){
            return getGameplayDatasetResult;
        }
        gameplayDataSet = [];
        for (var i = la.gameplays.length - 1; i >= 0; i--) {
            var idP = la.gameplays[i].idPlayer;
            for (var j = la.players.length - 1; j >= 0; j--) {
                if (la.players[j].idPlayer == idP) {
                    gameplayDataSet[gameplayDataSet.length] = $.extend(la.gameplays[i], la.players[j]);
                }
            }
        }
        getGameplayDatasetResult = gameplayDataSet;
        return gameplayDataSet;
    },
    sortFunctionTimeStarted: function (a, b) {
        var timeStartedA = a.timeStarted;
        var timeStartedB = b.timeStarted;

        var dateA = new Date(timeStartedA);
        var dateB = new Date(timeStartedB);

        return dateA - dateB;
    },
    getMedian : function (arrayNumbersOrdered) {
        // even number
        if (Math.floor(arrayNumbersOrdered.length / 2) == arrayNumbersOrdered.length / 2) {
            var num1 = arrayNumbersOrdered[Math.floor(arrayNumbersOrdered.length / 2)];
            var num2 = arrayNumbersOrdered[Math.floor(arrayNumbersOrdered.length / 2) - 1];
            return Math.round((num1 + num2) * 10 / 2) / 10;
        }
        // odd number
        else {
            return arrayNumbersOrdered[Math.floor(arrayNumbersOrdered.length / 2)];
        }
    },
    getAverage : function (arrayNumbersOrdered) {
        if (arrayNumbersOrdered.length === 0)
        {
            return 0;
        }
        var sumScore = 0;

        for (var i = 0 ; i < arrayNumbersOrdered.length ; i++)
        {
            sumScore += arrayNumbersOrdered[i];
        }

        return Math.round(sumScore *100 / arrayNumbersOrdered.length)/100;
    },
    getMinAverageMax : function (arrayNumbers) {
        
        // if empty array return 0
        if (arrayNumbers.length == 0) {
            return [0, 0, 0];
        }

        // if only one number return it 5 times.
        if (arrayNumbers.length == 1) {
            var n = arrayNumbers[0];
            return [n, n, n];
        }

        // otherwise
        arrayNumbers.sort(function (a, b) {
            return a - b
        });

        var arrayStats = [];
        // minimum
        arrayStats[0] = arrayNumbers[0];
        // average
        arrayStats[1] = this.getAverage(arrayNumbers);
        // maximum
        arrayStats[2] = arrayNumbers[arrayNumbers.length - 1];


        return arrayStats;
    },
    getPlayerLastDataset: function (la) {
        if (getPlayerLastDatasetResult.length > 0){
            return getPlayerLastDatasetResult;
        }
        var dataset = [];
        var i, j;
        for (i = la.gameplays.length - 1; i >= 0; i--) {
            var alreadyIn = false;
            var gp = la.gameplays[i];
            for (j = dataset.length - 1; j >= 0; j--) {
                if (gp.idPlayer == dataset[j].idPlayer) {
                    alreadyIn = true;
                }
            }
            if (!alreadyIn) {
                var idP = gp.idPlayer;
                var idGP = gp.id;
                var timeSpent = gp.timeSpent;
                var timeStarted = gp.timeStarted;
                var finalScores = gp.finalScores;
                var actions = gp.actions;
                var feedback = gp.feedback;

                // get last gameplay
                for (j = i - 1; j >= 0; j--) {
                    var gp2 = la.gameplays[j];
                    if (gp2.idPlayer == idP && gp2.id > idGP) {
                        idGP = gp2.id;
                        timeSpent = gp2.timeSpent;
                        timeStarted = gp2.timeStarted;
                        finalScores = gp2.finalScores;
                        actions = gp2.actions;
                        feedback = gp2.feedback;
                    }
                }
                var playerLast = {"id": idGP, "idPlayer": idP, "timeSpent": timeSpent,
                    "timeStarted": timeStarted, "finalScores": finalScores, "actions": actions, "feedback": feedback};

                for (j = la.players.length - 1; j >= 0; j--) {
                    if (la.players[j].idPlayer == idP) {
                        dataset[dataset.length] = $.extend(playerLast, la.players[j]);
                    }
                }
            }
        }
        getPlayerLastDatasetResult = dataset;
        return dataset;
    },
    getPlayerFirstDataset: function (la) {
        if (getPlayerFirstDatasetResult.length) {
            return getPlayerFirstDatasetResult;
        } 
        var dataset = [];
        var i, j;
        for (i = la.gameplays.length - 1; i >= 0; i--) {
            var alreadyIn = false;
            var gp = la.gameplays[i];
            for (j = dataset.length - 1; j >= 0; j--) {
                if (gp.idPlayer == dataset[j].idPlayer) {
                    alreadyIn = true;
                }
            }
            if (!alreadyIn) {
                var idP = gp.idPlayer;
                var idGP = gp.id;
                var timeSpent = gp.timeSpent;
                var timeStarted = gp.timeStarted;
                var finalScores = gp.finalScores;
                var actions = gp.actions;
                var feedback = gp.feedback;

                // get first gameplay
                for (j = 0; j < i; j++) {
                    var gp2 = la.gameplays[j];
                    if (gp2.idPlayer == idP && gp2.id < idGP) {
                        idGP = gp2.id;
                        timeSpent = gp2.timeSpent;
                        timeStarted = gp2.timeStarted;
                        finalScores = gp2.finalScores;
                        actions = gp2.actions;
                        feedback = gp2.feedback;
                    }
                }
                var playerFirst = {"id": idGP, "idPlayer": idP, "timeSpent": timeSpent,
                    "timeStarted": timeStarted, "finalScores": finalScores, "actions": actions, "feedback": feedback};

                for (j = la.players.length - 1; j >= 0; j--) {
                    if (la.players[j].idPlayer == idP) {
                        dataset[dataset.length] = $.extend(playerFirst, la.players[j]);
                    }
                }
            }
        }
        getPlayerFirstDatasetResult = dataset;
        return dataset;
    },
    getPlayerBestDataset: function (la, outcome) {
        var dataset = [];
        var i, j;
        for (i = la.gameplays.length - 1; i >= 0; i--) {
            var alreadyIn = false;
            var gp = la.gameplays[i];
            for (j = dataset.length - 1; j >= 0; j--) {
                if (gp.idPlayer == dataset[j].idPlayer) {
                    alreadyIn = true;
                }
            }

            if (!alreadyIn) {
                var idP = gp.idPlayer;
                var idGP = gp.id;
                var timeSpent = gp.timeSpent;
                var timeStarted = gp.timeStarted;
                var finalScores = gp.finalScores;
                var actions = gp.actions;
                var feedback = gp.feedback;

                // get last gameplay
                for (j = i - 1; j >= 0; j--) {
                    var gp2 = la.gameplays[j];
                    if (gp2.idPlayer == idP && gp2.finalScores[outcome] > finalScores[outcome]) {
                        idGP = gp2.id;
                        timeSpent = gp2.timeSpent;
                        timeStarted = gp2.timeStarted;
                        finalScores = gp2.finalScores;
                        actions = gp2.actions;
                        feedback = gp2.feedback;
                    }
                }


                var playerBest = {"id": idGP, "idPlayer": idP, "timeSpent": timeSpent,
                    "timeStarted": timeStarted, "finalScores": finalScores, "actions": actions, "feedback": feedback};

                for (j = la.players.length - 1; j >= 0; j--) {
                    if (la.players[j].idPlayer == idP) {
                        dataset[dataset.length] = $.extend(playerBest, la.players[j]);
                    }
                }
            }
        }
        return dataset;
    },
    getArrayStats: function (arrayNumbers) {
        
        // if empty array return 0
        if (arrayNumbers.length == 0) {
            return [0, 0, 0, 0, 0];
        }

        // if only one number return it 5 times.
        if (arrayNumbers.length == 1) {
            var n = arrayNumbers[0];
            return [n, n, n, n, n];
        }

        // otherwise

        arrayNumbers.sort(function (a, b) {
            return a - b
        });

        var arrayStats = [];
        // minimum
        arrayStats[0] = arrayNumbers[0];
        // lower quartile
        var firstHalf = arrayNumbers.slice(0, Math.floor(arrayNumbers.length / 2));
        arrayStats[1] = this.getMedian(firstHalf);
        // median
        arrayStats[2] = this.getMedian(arrayNumbers);
        // upper quartile
        var secondHalf = arrayNumbers.slice(Math.ceil(arrayNumbers.length / 2));
        arrayStats[3] = this.getMedian(secondHalf);
        // maximum
        arrayStats[4] = arrayNumbers[arrayNumbers.length - 1];

        return arrayStats;
    }, 
    getPlayerDataset: function (la) {
        if (getPlayerDatasetResult.length) {
            return getPlayerDatasetResult;
        } 
        var dataset = [];
        var i, j;
        for (i = la.gameplays.length - 1; i >= 0; i--) {
            var alreadyIn = false;
            var gp = la.gameplays[i];
            for (j = dataset.length - 1; j >= 0; j--) {
                if (gp.idPlayer == dataset[j].idPlayer) {
                    alreadyIn = true;
                }
            }

            if (!alreadyIn) {
                var idP = gp.idPlayer;
                var timeSpent = gp.timeSpent;
                var time = gp.timeStarted.split(' ')[1];
                var hours = parseInt(time.split(":")[0]);
                var minutes = parseInt(time.split(":")[1]);
                var timeStarted = hours * 60 + minutes;
                var nb = 1;

                // get average timeSpent and time
                for (j = i - 1; j >= 0; j--) {
                    var gp2 = la.gameplays[j];
                    if (gp2.idPlayer == idP) {
                        timeSpent += gp2.timeSpent;

                        var time1 = gp2.timeStarted.split(' ')[1];
                        timeStarted += parseInt(time2.split(":")[0]) * 60;
                        timeStarted += parseInt(time2.split(":")[1]);
                        nb++;
                    }
                }

                var avgTimeStarted = Math.round(timeStarted / nb);

                hours = Math.floor(avgTimeStarted / 60);
                minutes = avgTimeStarted - hours * 60;
                var avgTimeStart = hours + ":" + minutes;

                var avgForPlayer = {"idPlayer": idP, "timeSpent": Math.round(timeSpent / nb),
                    "timeStarted": avgTimeStart};

                for (j = la.players.length - 1; j >= 0; j--) {
                    if (la.players[j].idPlayer == idP) {
                        dataset[dataset.length] = $.extend(avgForPlayer, la.players[j]);
                    }
                }
            }
        }
        getPlayerDatasetResult = dataset;
        return dataset;
    },

    getValueForCustomFormula: function (arrayScores, formula)
    {
        listOutcomes = Object.keys(arrayScores);

        if (listOutcomes.length < 1) {
            return 0;
        }

        for (o in listOutcomes) {
            var outcome = arrayScores[listOutcomes[o]];
            formula = this.replaceAll(listOutcomes[o], outcome, formula);
        }

        if (formula.match(/[a-z]/i))
        {
            return "error, score not found";
        }

        var data = Parser.evaluate(formula);
        return data;
    },
    replaceAll: function(find, replace, str) {
      return str.replace(new RegExp(find, 'g'), replace);
    }
  };

  return utils;
});

learningAnalytics.directive('laWhoPlayed', function(utils){
    // set the view
    function process(la, view, characteristic) {
        var dataset = [];
        var data = [];
        var i, j, k, idP, nb;
        
        if (view == "gameplay") {
            for (i = la.gameplays.length - 1; i >= 0; i--) {
                idP = la.gameplays[i].idPlayer;

                for (j = la.players.length - 1; j >= 0; j--) {
                    if (la.players[j].idPlayer == idP) {
                        dataset[dataset.length] = la.players[j]
                    }
                }
            }
        }
        else if (view == "player") {
            for (i = la.gameplays.length - 1; i >= 0; i--) {
                var alreadyIn = false;
                for (j = dataset.length - 1; j >= 0; j--) {
                    if (la.gameplays[i].idPlayer == dataset[j].idPlayer) {
                        alreadyIn = true;
                    }
                }
                if (!alreadyIn) {
                    idP = la.gameplays[i].idPlayer;
                    for (j = la.players.length - 1; j >= 0; j--) {
                        if (la.players[j].idPlayer == idP) {
                            dataset[dataset.length] = la.players[j];
                        }
                    }
                }
            }
        }

        // find data to show in good format = array of ["value of characteristic", share]
        // check all characteristics values
        for (j = dataset.length - 1; j >= 0; j--) {
            var characteristicValue = "";
            var idP = -1;
            if (characteristic === "student")
            {
                idP = dataset[j].idPlayer;
                characteristicValue = utils.getUsernameById(la, idP);
            }
            else
            {
                characteristicValue = dataset[j][characteristic];
            }
            nb = 0;

            var charInData = false;

            // check if characteristic is already in the data array
            for (k = data.length - 1; k >= 0; k--) {
                if (data[k][0] == characteristicValue) {
                    charInData = true
                }
            }

            // if it's a new characteristic count how many times it appear
            if (!charInData) {
                for (k = dataset.length - 1; k >= 0; k--) {
                    if (characteristic === "student" && dataset[k].idPlayer == idP)
                    {
                        nb = nb + 1;
                    }
                    else if (dataset[k][characteristic] == characteristicValue) {
                        nb = nb + 1;
                    }
                }
                data[data.length] = [characteristicValue + "", nb];
            }
        }
        return data;
    }

    function draw(element, characteristic, data){
        element.highcharts({
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: 1,//null,
                    plotShadow: false
                },
                title: {
                    text: 'Who played? (by ' + characteristic + ')'
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                            style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                            }
                        }
                    }
                },
                series: [
                    {
                        type: 'pie',
                        name: characteristic + ' share',
                        data: data
                    }
                ]
            });
    }
    
    return {
        scope: {
            la: '=la',
            view: '=view',
            characteristic: '=characteristic'
        },
        link: function (scope, element) {
            
            scope.$watchGroup(['la', 'view', 'characteristic'], function (){
                var data = process(scope.la, scope.view, scope.characteristic);
                draw(element, scope.characteristic, data);
            });
        
        }
    };
});

learningAnalytics.directive('laWhen', function(utils){
    // set the view
    function process(la, view, characteristic, categories){
        // set the view
        var dataset = []
        if (view == "gameplay")
        {
            dataset = utils.getGameplayDataset(la);
        }
        else if (view == "player")
        {
            dataset = utils.getPlayerDataset(la);
        }

        if (dataset.length < 1) { return 0; }

        // for each characteristic, draw an area chart

        var data = [];
                
        // data by player
        if (characteristic === "student")
        {
            // check all players
            for (var j = 0 ; j < la.players.length ; j++) {
                var idP = la.players[j].idPlayer;

                var playerPerHour = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                
                for (var k = dataset.length - 1; k >= 0; k--) {
                    if (dataset[k].idPlayer === idP)
                    {
                        // if there is a new gp
                        var timeStart = dataset[k].timeStarted;
                        var hour = parseInt(timeStart.split(" ")[1].split(":")[0]);
                        playerPerHour[hour]++;
                    }
                };
                data[data.length] = {"type":"column", "name": utils.getUsernameById(la, idP), "data":playerPerHour };
            };
        }
        else {
            // check all characteristics values
            for (var j = dataset.length - 1; j >= 0; j--) {
                var characteristicValue = dataset[j][characteristic];
                var nb = 0;
                    
                var charInData = false;

                // check if characteristic is already in the data array
                for (var k = data.length - 1; k >= 0; k--) {
                    if (data[k].name == characteristicValue)
                    {
                        charInData = true;
                    }
                };

                // if it's a new characteristic:
                // count how many times it appear, calculate the avg, max and min
                if (!charInData)
                {
                    var hour = parseInt(dataset[j].timeStarted.split(" ")[1].split(":")[0]);
                    var playerPerHour = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                    playerPerHour[hour]++;

                    for (var k = j - 1; k >= 0; k--) {
                        if (dataset[k][characteristic] == characteristicValue)
                        {
                            // if there is a new gp
                            hour = parseInt(dataset[k].timeStarted.split(" ")[1].split(":")[0]);
                            playerPerHour[hour]++;
                        }
                    };
                    data[data.length] = {"type":"column", "name":characteristicValue, "data":playerPerHour };
                };                  
            };
        }

        // add the total
        
        var playerPerHour = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];                       
        var morning = 0;
        var afternoon = 0;
        var evening = 0;
        var night = 0;
        var nb = 0;

        while (dataset.length > nb)
        {
            hour = parseInt(dataset[nb++].timeStarted.split(" ")[1].split(":")[0]);
            playerPerHour[hour]++;

            if (hour>5 && hour <12)
            {
                morning++;
            }
            else if (hour>11 && hour <18)
            {
                afternoon++;
            }
            else if (hour>17 && hour <23)
            {
                evening++;
            }
            else 
            {
                night++;
            }
        }

        data[data.length] = {"type":"spline", "name":"total", "data":playerPerHour, 
                                marker: {
                                lineWidth: 2,
                                lineColor: Highcharts.getOptions().colors[data.length % 10],
                                fillColor: 'white'
                            } };

        var pieData = [{name:"morning", y:morning, color: Highcharts.getOptions().colors[data.length]},
                        {name:"afternoon", y:afternoon, color: Highcharts.getOptions().colors[data.length+1]}, 
                        {name:"evening", y:evening, color: Highcharts.getOptions().colors[data.length+2]}, 
                        {name:"night", y:night, color: Highcharts.getOptions().colors[data.length+3]}];

        data[data.length] = {"type":"pie", "name":"Summary", "data":pieData, 
                                center: [80, 60],
                                size: 80,
                                showInLegend: false,
                                dataLabels: {
                                    enabled: true
                            } };
        
        return data
    }

    function draw(element, characteristic, data, categories){
        // draw combined chart
        element.highcharts({
            title: {
                text: 'When did they play? (by ' + characteristic + ')'
            },
            xAxis: {
                title: {
                    text: 'Hour'
                }
            },
            yAxis: {
                title: {
                    text: 'Number of players'
                }
            },
            labels: {
                items: [{
                    html: 'Summary',
                    style: {
                        left: '50px',
                        top: '18px',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
                    }
                }]
            },
            series: data
        });
    }
    
    return {
        scope: {
            la: '=la',
            view: '=view',
            characteristic: '=characteristic'
        },
        link: function (scope, element) {
            var categories = ["average", "max", "min"];
            scope.$watchGroup(['la', 'view', 'characteristic'], function (){
                var data = process(scope.la, scope.view, scope.characteristic, categories);
                draw(element, scope.characteristic, data, categories);
            });
        
        }
    };
});

learningAnalytics.directive('laTimeline', function(utils){
    // helper
    function compareDate(a, b)
    {
        var aTime = a.timeStarted.split(" ")[0].split("-");
        var da = Date.UTC(parseInt(aTime[0]), aTime[1]-1, aTime[2]);

        var bTime = b.timeStarted.split(" ")[0].split("-");
        var db = Date.UTC(parseInt(bTime[0]), bTime[1]-1, bTime[2]);

        return (a-b);
    }

    // set the view
    function process(la, characteristic, categories){
        // set the view
        var dataset = utils.getGameplayDataset(la);

        if (dataset.length < 1) { return 0; }

        // for each characteristic, draw an area chart
        var data = [];
                
        // data by player
        if (characteristic === "student")
        {
            // check all players
            
            for (var j = 0 ; j < la.players.length ; j++) {
                var idP = la.players[j].idPlayer;

                // initialise with todays date
                var today = new Date();
                var todayDay = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() );

                var days = [];
                //days.push(todayDay);
                var playerPerDay = [];
                //playerPerDay.push(0);
                
                for (var k = dataset.length - 1; k >= 0; k--) {
                    if (dataset[k].idPlayer === idP)
                    {
                        // if there is a new gp
                        var timeStart = dataset[k].timeStarted;
                        var date = timeStart.split(" ")[0].split("-");
                        var dateJS = Date.UTC(parseInt(date[0]), parseInt(date[1])-1, parseInt(date[2])); 

                        // enter date if not in array
                        var indexOfDate = days.indexOf(dateJS);
                        if ( indexOfDate == -1 )
                        {
                            days.push(dateJS);
                            playerPerDay.push(1);
                        }

                        // otherwise increment count
                        else
                        {
                            playerPerDay[indexOfDate]++;
                        }
                    }
                };
                
                var dataHighchart = [];

                for (var l = playerPerDay.length - 1; l >= 0; l--) {
                    var dataDay = [days[l], playerPerDay[l]];
                    dataHighchart.push(dataDay);
                };

                data[data.length] = {"type":"column", "name": utils.getUsernameById(la, idP), "data":dataHighchart };
            };            
        }
        else {
            // check all characteristics values
            for (var j = dataset.length - 1; j >= 0; j--) {
                var characteristicValue = dataset[j][characteristic];
                var nb = 0;
                    
                var charInData = false;

                // check if characteristic is already in the data array
                for (var k = data.length - 1; k >= 0; k--) {
                    if (data[k].name == characteristicValue)
                    {
                        charInData = true;
                    }
                };
                
                // if it's a new characteristic:
                // count how many times it appear
                if (!charInData)
                {
                    var timeStart = dataset[j].timeStarted;
                    var date = timeStart.split(" ")[0].split("-");
                    var dateJS = Date.UTC(parseInt(date[0]), parseInt(date[1])-1, parseInt(date[2])); 

                    var days = [];
                    days.push(dateJS);
                    var playerPerDay = [];
                    playerPerDay.push(1);

                    for (var k = j - 1; k >= 0; k--) {
                        if (dataset[k][characteristic] == characteristicValue)
                        {
                            // if there is a new gp
                            var timeStart = dataset[k].timeStarted;
                            var date = timeStart.split(" ")[0].split("-");
                            var dateJS = Date.UTC(parseInt(date[0]), parseInt(date[1])-1, parseInt(date[2])); 

                            // enter date if not in array
                            var indexOfDate = days.indexOf(dateJS);
                            if ( indexOfDate == -1 )
                            {
                                days.push(dateJS);
                                playerPerDay.push(1);
                            }

                            // otherwise increment count
                            else
                            {
                                playerPerDay[indexOfDate]++;
                            }
                        }
                    };

                    var dataHighchart = [];

                    for (var l = playerPerDay.length - 1; l >= 0; l--) {
                        var dataDay = [days[l], playerPerDay[l]];
                        dataHighchart.push(dataDay);
                    };


                    data[data.length] = {"type":"column", "name":characteristicValue, "data":dataHighchart };
                };                  
                
            };
        }

        // add the total
        var dataHighchart = [];  
        var days = [];
        var playerPerDay = [];
        var nb = 0;

        while (dataset.length > nb)
        {
            var timeStart = dataset[nb++].timeStarted;
            var date = timeStart.split(" ")[0].split("-");

            var year = parseInt(date[0]);
            var month = parseInt(date[1])-1;
            var day = parseInt(date[2]);

            var dateJS = Date.UTC(year, month, day); 

            // enter date if not in array
            var indexOfDate = days.indexOf(dateJS);
            if ( indexOfDate == -1 )
            {
                days.push(dateJS);
                playerPerDay.push(1);
            }
            // otherwise increment count
            else
            {
                playerPerDay[indexOfDate]++;
            }
        }


        for (var l = playerPerDay.length - 1; l >= 0; l--) {
            var dataDay = [days[l], playerPerDay[l]];
            dataHighchart.push(dataDay);
        };

        data[data.length] = {"type":"spline", "name":"total", "data":dataHighchart, 
                                marker: {
                                lineWidth: 2,
                                lineColor: Highcharts.getOptions().colors[data.length % 10],
                                fillColor: 'white'
                            } };   
        return data
    }

    function draw(element, characteristic, data, categories){
        // draw combined chart
        element.highcharts({
            chart: {
                zoomType: 'x'
            },
            title: {
                text: 'Gameplays timeline (by ' + characteristic + ')'
            },
            subtitle: {
                text: document.ontouchstart === undefined ?
                        'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
            },
            xAxis: {
                type: 'datetime',
                title: {
                    text: 'Date'
                }
            },
            yAxis: {
                title: {
                    text: 'Number of players'
                }
            },
            series: data
        });
    }
    
    return {
        scope: {
            la: '=la',
            characteristic: '=characteristic'
        },
        link: function (scope, element) {
            var categories = ["average", "max", "min"];
            scope.$watchGroup(['la', 'characteristic'], function (){
                var data = process(scope.la, scope.characteristic, categories);
                draw(element, scope.characteristic, data, categories);
            });
        
        }
    };
});

learningAnalytics.directive('laHowLong', function(utils){
    // set the view
    function process(la, view, characteristic, categories) {
        var i, j, k, nb;

        var totalTimeSpent, maxTimeSpent, minTimeSpent, timeS, avgTimeSpent;
        // set the view
        var dataset = utils.getGameplayDataset(la);
        

        if (dataset.length < 1) {
            return 0;
        }

        // find data to show in good format = array of {name:"...", data:[avg, max, min]}
        var data = [];

        // check all characteristics values
        for (j = dataset.length - 1; j >= 0; j--) {
            var characteristicValue = dataset[j][characteristic];
            nb = 0;

            var charInData = false;

            // check if characteristic is already in the data array
            for (k = data.length - 1; k >= 0; k--) {
                var valueC = (characteristicValue!= null && characteristicValue.username != null)?
                                characteristicValue.username :
                                characteristicValue;
                if (data[k].name == valueC) {
                    charInData = true;
                }
            }

            // if it's a new characteristic:
            // count how many times it appear, calculate the avg, max and min
            if (!charInData) {
                totalTimeSpent = dataset[j].timeSpent;
                maxTimeSpent = dataset[j].timeSpent ;
                minTimeSpent = dataset[j].timeSpent ;
                nb = 1;
                for (k = j - 1; k >= 0; k--) {
                    if (dataset[k][characteristic] == characteristicValue) {
                        // if there is a new gp
                        nb++;
                        timeS = dataset[k].timeSpent;
                        totalTimeSpent += timeS;
                        if (maxTimeSpent < timeS) {
                            maxTimeSpent = timeS;
                        }
                        if (minTimeSpent > timeS) {
                            minTimeSpent = timeS;
                        }
                    }
                }
                var valueC = (characteristicValue!= null && characteristicValue.username != null)?
                                characteristicValue.username :
                                characteristicValue;
                if (view == "total") {
                    data[data.length] = {"name": valueC, "data": [Math.round(totalTimeSpent/60)] };            
                }
                else if (view == "average") {
                    avgTimeSpent = Math.round(totalTimeSpent / nb);
                    data[data.length] = {"name": valueC, "data": [avgTimeSpent/60, maxTimeSpent/60, minTimeSpent/60] };         
                }                
            }
        }

        // add the total

        totalTimeSpent = 0;
        nb = 0;

        while (dataset.length > nb) {
            timeS = dataset[nb++].timeSpent;
            totalTimeSpent += timeS;
            if (maxTimeSpent < timeS) {
                maxTimeSpent = timeS;
            }
            if (minTimeSpent > timeS) {
                minTimeSpent = timeS;
            }
        }
        if (view == "total") {
            avgTimeSpent = Math.round(totalTimeSpent / data.length);
            data[data.length] = {"name": "average", "data": [avgTimeSpent/60] };               
        }
        else if (view == "average") {
            avgTimeSpent = Math.round(totalTimeSpent / nb);
            data[data.length] = {"name": "all", "data": [avgTimeSpent/60, maxTimeSpent/60, minTimeSpent/60] };            
        }


        // draw bar chart
        return data;

    }

    function draw(element, characteristic, data, categories){
        element.highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: 'Time spent (by ' + characteristic + ')'
            },
            xAxis: {
                categories: categories
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Time spent (in minutes)'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f} min</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.1,
                    borderWidth: 0
                }
            },
            series: data
        });
    }
    
    return {
        scope: {
            la: '=la',
            view: '=view',
            characteristic: '=characteristic'
        },
        link: function (scope, element) {
            scope.$watchGroup(['la', 'view', 'characteristic'], function (){
                var categories = [];
                if (scope.view == "total") {
                    categories = ["total time spent"];                 
                }
                else if (scope.view == "average") {
                    categories = ["average", "max", "min"];          
                }
                var data = process(scope.la, scope.view, scope.characteristic, categories);
                draw(element, scope.characteristic, data, categories);
            });
        
        }
    };
});

learningAnalytics.directive('laHowManyTimes', function(utils){
    // set the view
    function process(la, view, characteristic) {
        var numGPs;
        var i, j, k;
        // for each characteristic, draw a bar chart

        var categories = [];

        if (characteristic === 'student') {

            var playerIds = [];
            numGPs = [];

            for (k = la.players.length - 1; k >= 0; k--) {
                playerIds[playerIds.length] = utils.getUsernameById(la, la.players[k].idPlayer);
                var numGPsForP = 0;
                for (j = la.gameplays.length - 1; j >= 0; j--) {
                    if (la.gameplays[j].idPlayer === la.players[k].idPlayer) {
                        numGPsForP++;
                    }
                }
                numGPs[numGPs.length] = numGPsForP;
            }

            categories = playerIds;
        }
        else {
            numGPs = [];

            for (k = la.players.length - 1; k >= 0; k--) {

                var characteristicValue = la.players[k][characteristic];
                // if haven't counted this characteristicValue
                if (categories.indexOf(characteristicValue) == -1) {
                    categories.push(characteristicValue);

                    var numGPsForChar = 0;
                    var playersWithChar = [];

                    var dataset = utils.getGameplayDataset(la);

                    for (j = dataset.length - 1; j >= 0; j--) {
                        if (dataset[j][characteristic] == characteristicValue) {
                            numGPsForChar++;

                            if (playersWithChar.indexOf(dataset[j].idPlayer) == -1) {
                                playersWithChar.push(dataset[j].idPlayer);
                            }
                        }
                    }

                    numGPs.push(Math.round(numGPsForChar * 10 / playersWithChar.length) / 10);
                }
            }
        }

        // draw bar chart
        return { data: numGPs, categories: categories};

    }

    function draw(element, characteristic, data, categories){
        element.highcharts({
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'How many gameplay per student?'
                },
                xAxis: {
                    categories: categories
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'number of gameplays'
                    }
                },
                series: [
                    {
                        name: 'Gameplays per player',
                        data: data,
                        color: Highcharts.getOptions().colors[categories.length % 10]
                    }
                ]
            });
    }
    
    return {
        scope: {
            la: '=la',
            view: '=view',
            characteristic: '=characteristic'
        },
        link: function (scope, element) {
            scope.$watchGroup(['la', 'view', 'characteristic'], function (){
                var output = process(scope.la, scope.view, scope.characteristic);
                draw(element, scope.characteristic, output.data, output.categories);
            });
        
        }
    };
});

learningAnalytics.directive('laFinalScores', function(utils){
    // set the view
    function process(la, view, characteristic, outcome, bestoutcome, formula) {
        // set the view
        var dataset = [];
        var i, j, k;
        var scoresList;
        if (view == "gameplay") {
            dataset = utils.getGameplayDataset(la);
        }
        else if (view == "playerFirst") {
            dataset = utils.getPlayerFirstDataset(la);
        }
        else if (view == "playerLast") {
            dataset = utils.getPlayerLastDataset(la);
        }
        else if (view == "playerBest") {
            dataset = utils.getPlayerBestDataset(la, bestoutcome);
        }

        if (dataset.length < 1) {
            return 0;
        }

        // find data to show in good format = array of {name:"...", data:[avg, max, min]}
        var data = [];
        var categories = [];

        // check all characteristics values
        for (j = dataset.length - 1; j >= 0; j--) {
            var characteristicValue = dataset[j][characteristic];

            var charInData = false;

            // check if characteristic is already in the data array
            for (k = categories.length - 1; k >= 0; k--) {
                var valueC = (characteristicValue!= null && characteristicValue.username != null)?
                                characteristicValue.username :
                                characteristicValue;
                if (categories[k] == valueC) {
                    charInData = true;
                }
            }

            // if it's a new characteristic:
            // count how many times it appear, calculate the avg, max and min
            if (!charInData) {
                var valueC = (characteristicValue!= null && characteristicValue.username != null)?
                                characteristicValue.username :
                                characteristicValue;
                categories[categories.length] = valueC;

                scoresList = [];
                if (outcome === "_custom_")
                {
                    var formulaParsed = utils.getValueForCustomFormula(dataset[j].finalScores, formula);
                    scoresList[0] = formulaParsed;
                    var formulaParsed_tostring = formulaParsed + " ";
                    if (formulaParsed_tostring.match(/[a-z]/i))
                    {
                        return { data: null, categories: null, title: "error, score not found"};
                    }
                }
                else
                {
                    scoresList[0] = dataset[j].finalScores[outcome];
                }

                for (k = j - 1; k >= 0; k--) {
                    if (dataset[k][characteristic] == characteristicValue) {
                        // if there is a new gp
                        if (outcome === "_custom_")
                        {
                            scoresList[scoresList.length] = utils.getValueForCustomFormula(dataset[k].finalScores, formula);
                        }
                        else
                        {
                            scoresList[scoresList.length] = dataset[k].finalScores[outcome];
                        }                                
                    }
                }
                data[data.length] = utils.getArrayStats(scoresList);
            }
        }

        // add the total
        scoresList = [];

        for (j = 0; j < dataset.length; j++) {
            if (outcome === "_custom_")
            {
                scoresList[j] = utils.getValueForCustomFormula(dataset[j].finalScores, formula);
            }
            else
            {
                scoresList[j] = dataset[j].finalScores[outcome];
            }
        }

        categories[categories.length] = "Total";
        data[data.length] = utils.getArrayStats(scoresList);

        var title = (outcome === "_custom_")? formula : outcome;

        // draw bar chart
        return { data: data, categories: categories, title: title};

    }

    function draw(element, characteristic, data, categories, title){
        element.highcharts({

            chart: {
                type: 'boxplot'
            },

            title: {
                text: 'Final scores by ' + characteristic
            },

            subtitle: {
                text: title
            },

            legend: {
                enabled: false
            },

            xAxis: {
                categories: categories
            },

            yAxis: {
                title: {
                    text: 'Score'
                }
            },

            series: [
                {
                    name: 'Scores',
                    data: data,
                    tooltip: {
                        headerFormat: '<em>Score for {point.key}</em><br/>'
                    }
                }
            ]

        });
    }
    
    return {
        scope: {
            la: '=la',
            view: '=view',
            outcome: '=outcome',
            characteristic: '=characteristic',
            bestoutcome: '=bestoutcome',
            formula: '=formula'
        },
        link: function (scope, element) {
            scope.$watchGroup(['la', 'view', 'characteristic', 'outcome', 'bestoutcome', 'formula'], function (){
                var output = process(scope.la, scope.view, scope.characteristic, scope.outcome, scope.bestoutcome, scope.formula);
                draw(element, scope.characteristic, output.data, output.categories, output.title);
            });
        
        }
    };
});

learningAnalytics.directive('laLearningCurves', function(utils){
    // set the view
    function process(la, view, characteristic, outcome, bestoutcome) {
        // set the view
        var i, j, k;
        var point, score;
        // set the view
        var dataset = [];
        if (view == "gameplay") {
            dataset = utils.getGameplayDataset(la);
        }
        else if (view == "playerFirst") {
            dataset = utils.getPlayerFirstDataset(la);
        }
        else if (view == "playerLast") {
            dataset = utils.getPlayerLastDataset(la);
        }
        else if (view == "playerBest") {
            dataset = utils.getPlayerBestDataset(la, bestoutcome);
        }

        if (dataset.length < 1) {
            return 0;
        }

        // find data to show in good format
        var data = [];


        if (characteristic === "student") {

            // draw every line
            for (j = dataset.length - 1; j >= 0; j--) {
                //initialise score
                point = [];
                score = la.game.learningOutcomes[outcome].value;
                point[0] = 0;
                point[1] = score;

                points = [];
                points[0] = point;

                dataset[j].actions.sort(function (a, b) {
                    return a.timestamp - b.timestamp
                });

                for (k = 0; k < dataset[j].actions.length; k++) {
                    
                    point = [];
                    point[0] = dataset[j].actions[k].timestamp;
                    if(dataset[j].actions[k].outcome == outcome)
                    {
                        score += dataset[j].actions[k].mark;
                    }
                    point[1] = score;

                    points[points.length] = point;
                }
                data[data.length] = {"name": utils.getUsernameById(la, dataset[j].idPlayer), "data": points};
            }
        }
        else {
            var characteristics = [];

            // draw a line foreach characteristic value
            for (j = dataset.length - 1; j >= 0; j--) {

                var characteristicValue = dataset[j][characteristic];

                if (characteristics.indexOf(characteristicValue) == -1) {
                    characteristics.push(characteristicValue);
                }

                //initialise score
                point = [];
                score = la.game.learningOutcomes[outcome].value;
                point[0] = 0;
                point[1] = score;

                var points = [];
                points[0] = point;

                dataset[j].actions.sort(function (a, b) {
                    return a.timestamp - b.timestamp
                });

                for (k = 0; k < dataset[j].actions.length; k++) {
                    point = [];
                    point[0] = dataset[j].actions[k].timestamp;
                    if(dataset[j].actions[k].outcome == outcome)
                    {
                        score += dataset[j].actions[k].mark;
                    }
                    point[1] = score;

                    points[points.length] = point;
                }
                data[data.length] = {"name": characteristicValue + " (" + dataset[j].idPlayer + ")",
                    "data": points,
                    "color": Highcharts.getOptions().colors[characteristics.indexOf(characteristicValue) % 10]
                };
            }
        }

        // draw bar chart
        return data;

    }

    function draw(element, characteristic, data, outcome){
        element.highcharts({
            title: {
                text: 'Learning curve by ' + characteristic,
                x: -20 //center
            },
            subtitle: {
                text: outcome,
                x: -20
            },
            xAxis: {
                title: {
                    text: 'time'
                }
            },
            yAxis: {
                title: {
                    text: 'score'
                },
                plotLines: [
                    {
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }
                ]
            },
            tooltip: {
                headerFormat: '<b>{series.name} : {point.y}</b><br/>'
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: data
        });
    }
    
    return {
        scope: {
            la: '=la',
            view: '=view',
            outcome: '=outcome',
            characteristic: '=characteristic',
            bestoutcome: '=bestoutcome'
        },
        link: function (scope, element) {
            scope.$watchGroup(['la', 'view', 'characteristic', 'outcome', 'bestoutcome'], function (){
                var data = process(scope.la, scope.view, scope.characteristic, scope.outcome, scope.bestoutcome);
                draw(element, scope.characteristic, data, scope.outcome);
            });
        
        }
    };
});

learningAnalytics.directive('laLearningCurvesWithinGameplays', function(utils){

    function process(la, characteristic, outcome, formula) {
        var point;
        var dataset = utils.getGameplayDataset(la);

        if (dataset.length < 1) {
            return 0;
        }

        dataset.sort(utils.sortFunctionTimeStarted);

        var characteristics = [];
        var players = [];
        // find data to show in good format
        var data = [];


        // draw every line
        for (var j = dataset.length - 1; j >= 0; j--) {
            //initialise score
            var c = (characteristic == "student") ? "idPlayer" : characteristic;
            var characteristicValue = dataset[j][c];
            var idP = dataset[j].idPlayer;

            if (characteristics.indexOf(characteristicValue) == -1) {
                characteristics.push(characteristicValue);
            }

            if (players.indexOf(idP) == -1) {
                players.push(idP);

                var tryNumber = 0;

                point = [];
                point[0] = tryNumber;

                if (outcome === "_custom_")
                {
                    var formula2 = formula + " ";
                    listOutcomes = Object.keys(la.game.learningOutcomes);
                    for (o in listOutcomes) {
                        var outcome2 = la.game.learningOutcomes[listOutcomes[o]];

                        formula2 = utils.replaceAll(listOutcomes[o], outcome2.value, formula2);
                    }

                    if (formula2.match(/[a-z]/i))
                    {
                        formula = "error, score not found";
                        return null;
                    }

                    var formulaParsed = Parser.evaluate(formula2);

                    point[1] = formulaParsed;                    
                }
                else
                {
                    point[1] = la.game.learningOutcomes[outcome].value;
                }          

                var points = [];
                points[0] = point;

                for (var k = 0; k < dataset.length; k++) {
                    if (idP === dataset[k].idPlayer) {
                        tryNumber++;
                        point = [];
                        point[0] = tryNumber;
                        if (outcome === "_custom_")
                        {
                            var pt1 = utils.getValueForCustomFormula(dataset[k].finalScores, formula);
                            point[1] = pt1;
                        }
                        else
                        {
                            point[1] = dataset[k].finalScores[outcome];
                        }

                        points.push(point);
                    }
                }
                var value = (characteristic == "student") ? 
                                utils.getUsernameById(la, dataset[j].idPlayer) : 
                                characteristicValue + " (" + dataset[j].idPlayer + ")";
                data[data.length] = {"name": value,
                    "data": points,
                    "color": Highcharts.getOptions().colors[characteristics.indexOf(characteristicValue) % 10]
                };
            }

        }
        return data;
    }

    function draw(element, characteristic, data, outcome, formula){
        // draw chart in containerLearningCurveBy + characteristic
        var title = (outcome === "_custom_")? formula : outcome;
        element.highcharts({
            title: {
                text: 'Learning curve by ' + characteristic,
                x: -20 //center
            },
            subtitle: {
                text: title,
                x: -20
            },
            xAxis: {
                title: {
                    text: 'number of gameplay'
                }
            },
            yAxis: {
                title: {
                    text: 'score'
                },
                plotLines: [
                    {
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }
                ]
            },
            tooltip: {
                headerFormat: '<b>{series.name} : {point.y}</b><br/>'
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: data
        });
    }
    
    return {
        scope: {
            la: '=la',
            outcome: '=outcome',
            characteristic: '=characteristic',
            formula: '=formula'
        },
        link: function (scope, element) {
            scope.$watchGroup(['la', 'characteristic', 'outcome', 'formula'], function (){
                var data = process(scope.la, scope.characteristic, scope.outcome, scope.formula);
                draw(element, scope.characteristic, data, scope.outcome, scope.formula);
            });
        
        }
    };
});

learningAnalytics.directive('laCommonActions', function(utils){
    // set the view
    function process(la, action, outcome, sign, leastcommon, bestoutcome) {
        //var i, j, k, nb;

        //var totalTimeSpent, maxTimeSpent, minTimeSpent, timeS, avgTimeSpent;
        
        var dataset = utils.getGameplayDataset(la);
        var datasetFirst = utils.getPlayerFirstDataset(la);
        var datasetLast = utils.getPlayerLastDataset(la);
        var datasetBest = utils.getPlayerBestDataset(la, bestoutcome);

        if (dataset.length < 1) {
            return 0;
        }

        // find data to show in good format = json : { categories:[c1, c2, ...], series: [{name:"...", data:[n1, n2, ..., n6]}, ...] }
        var data;
        var categories = [];
        var series = [];
 
        var paramFirst = {};
        var paramLast = {};    
        var paramBest = {}; 
        var paramAll = {};   

        var countAll = 0;
        var countFirst = 0;
        var countBest = 0;
        var countLast = 0;  

        // look for params of action to sort by
        angular.forEach(dataset, function (d) {
            angular.forEach(d.actions, function (a) {
                if (a.action === action)
                {
                    countAll++;
                    if (a.outcome === outcome &&( (a.mark < 0 && sign === "-") || (a.mark >= 0 && sign === "+")) )
                    {
                        var params = Object.keys(a.parameters);
                        var p_toString = "";

                        angular.forEach(params, function (p) {
                            p_toString += "_" + a.parameters[p];
                        });

                        p_toString = p_toString.substring(1);

                        if (paramAll[p_toString] != null)
                        {
                            paramAll[p_toString] += 1;
                        }
                        else
                        {
                            paramAll[p_toString] = 1;
                            paramLast[p_toString] = 0;
                            paramBest[p_toString] = 0;
                            paramFirst[p_toString] = 0;
                        }
                    }
                }
            });
        });

        // look for params of action in FIRST
        angular.forEach(datasetFirst, function (d) {
            angular.forEach(d.actions, function (a) {
                if (a.action === action)
                {
                    countFirst++;
                    var params = Object.keys(a.parameters);
                    var p_toString = "";

                    angular.forEach(params, function (p) {
                        p_toString += "_" + a.parameters[p];
                    });

                    p_toString = p_toString.substring(1);

                    if (paramFirst[p_toString] != null)
                    {
                        paramFirst[p_toString] += 1;
                    }
                    else
                    {
                        paramFirst[p_toString] = 1;
                    }
                }
            });
        });


        // look for params of action in LAST
        angular.forEach(datasetLast, function (d) {
            angular.forEach(d.actions, function (a) {
                if (a.action === action)
                {
                    countLast++;
                    var params = Object.keys(a.parameters);
                    var p_toString = "";

                    angular.forEach(params, function (p) {
                        p_toString += "_" + a.parameters[p];
                    });

                    p_toString = p_toString.substring(1);

                    if (paramLast[p_toString] != null)
                    {
                        paramLast[p_toString] += 1;
                    }
                    else
                    {
                        paramLast[p_toString] = 1;
                    }
                }
            });
        });

        // look for params of action in BEST
        angular.forEach(datasetBest, function (d) {
            angular.forEach(d.actions, function (a) {
                if (a.action === action)
                {
                    countBest++;
                    var params = Object.keys(a.parameters);
                    var p_toString = "";

                    angular.forEach(params, function (p) {
                        p_toString += "_" + a.parameters[p];
                    });

                    p_toString = p_toString.substring(1);

                    if (paramBest[p_toString] != null)
                    {
                        paramBest[p_toString] += 1;
                    }
                    else
                    {
                        paramBest[p_toString] = 1;
                    }
                }
            });
        });

        var array=[];

        for(p in paramAll){
         array.push([p.trim(),paramAll[p]]);
        }

        array.sort(function(a,b){return a[1] - b[1]});

        var title = "...";

        if (leastcommon === "true")
        {
            title = "Least common actions";
        }
        else if (leastcommon === "false")
        {
            array.reverse();
            title = "Most common actions";
        }

        var allSerieData = [];
        var firstSerieData = [];
        var lastSerieData = [];
        var bestSerieData = [];

        var i = 0;
        while ( i < 8 && i < array.length)
        {
            categories.push(array[i][0]);

            firstSerieData.push(paramFirst[array[i][0]] * 100/datasetFirst.length);
            lastSerieData.push(paramLast[array[i][0]] * 100/datasetLast.length);
            bestSerieData.push(paramBest[array[i][0]] * 100/datasetBest.length);
            allSerieData.push(array[i][1] * 100/dataset.length);

            i++;
        }

        if (leastcommon === "true")
        {
            categories.reverse();
            firstSerieData.reverse();
            lastSerieData.reverse();
            bestSerieData.reverse();
            allSerieData.reverse();       
        }

        firstSerie = {"name": "First", "data": firstSerieData};
        lastSerie = {"name": "Last", "data": lastSerieData};
        bestSerie = {"name": "Best", "data": bestSerieData};
        allSerie = {"name": "All", "data": allSerieData};
        series.push(firstSerie);
        series.push(lastSerie);
        series.push(bestSerie);
        series.push(allSerie);

        // draw bar chart
        data = {"categories": categories, "series": series, "title": title}
        return data;

    }

    function draw(element, data){
        element.highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: data.title
            },
            xAxis: {
                categories: data.categories
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'selected (%)'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.2f} %</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.1,
                    borderWidth: 0
                }
            },
            series: data.series
        });
    }
    
    return {
        scope: {
            la: '=la',
            action: '=action',
            outcome: '=outcome',
            sign: '=sign',
            leastcommon: '=leastcommon',
            bestoutcome: '=bestoutcome'
        },
        link: function (scope, element) {
            scope.$watchGroup(['la', 'action', 'outcome', 'sign', 'leastcommon', 'bestoutcome'], function (){
                var data = process(scope.la, scope.action, scope.outcome, scope.sign, scope.leastcommon, scope.bestoutcome);
                draw(element, data);
            });
        
        }
    };
});

learningAnalytics.directive('laDetailedAction', function(utils){
    // set the view
    function process(la, action, param, outcome, characteristic, categories) {

        var datasetAll = utils.getGameplayDataset(la);
        var datasetFirst = utils.getPlayerFirstDataset(la);
        var datasetLast = utils.getPlayerLastDataset(la);
        var datasetBest = utils.getPlayerBestDataset(la, outcome);

        if (datasetAll.length < 1) {
            return 0;
        }

        // find data to show in good format = array of {name:"...", data:[avg, max, min]}
        var data = [];

        var countBest = 0;
        var countParamBest = 0;

        // look for params of action in BEST
        angular.forEach(datasetBest, function (d) {
            angular.forEach(d.actions, function (a) {
                if (a.action === action)
                {
                    countBest++;
                    var params = Object.keys(a.parameters);
                    var p_toString = "";

                    angular.forEach(params, function (p) {
                        p_toString += "_" + a.parameters[p];
                    });

                    p_toString = p_toString.substring(1);

                    if (p_toString === param)
                    {
                        countParamBest++;
                    }
                }
            });
        });

        var countFirst = 0;
        var countParamFirst = 0;

        // look for params of action in FIRST
        angular.forEach(datasetFirst, function (d) {
            angular.forEach(d.actions, function (a) {
                if (a.action === action)
                {
                    countFirst++;
                    var params = Object.keys(a.parameters);
                    var p_toString = "";

                    angular.forEach(params, function (p) {
                        p_toString += "_" + a.parameters[p];
                    });

                    p_toString = p_toString.substring(1);

                    if (p_toString === param)
                    {
                        countParamFirst++;
                    }
                }
            });
        });

        var countLast = 0;
        var countParamLast = 0;

        // look for params of action in FIRST
        angular.forEach(datasetLast, function (d) {
            angular.forEach(d.actions, function (a) {
                if (a.action === action)
                {
                    countLast++;
                    var params = Object.keys(a.parameters);
                    var p_toString = "";

                    angular.forEach(params, function (p) {
                        p_toString += "_" + a.parameters[p];
                    });

                    p_toString = p_toString.substring(1);

                    if (p_toString === param)
                    {
                        countParamLast++;
                    }
                }
            });
        });


        var countAll = 0;
        var countParamAll = 0;

        // look for params of action in FIRST
        angular.forEach(datasetAll, function (d) {
            angular.forEach(d.actions, function (a) {
                if (a.action === action)
                {
                    countAll++;
                    var params = Object.keys(a.parameters);
                    var p_toString = "";

                    angular.forEach(params, function (p) {
                        p_toString += "_" + a.parameters[p];
                    });

                    p_toString = p_toString.substring(1);

                    if (p_toString === param)
                    {
                        countParamAll++;
                    }
                }
            });
        });
        /*
        // check all characteristics values
        for (var j = datasetAll.length - 1; j >= 0; j--) {
            var characteristicValue = datasetAll[j][characteristic];
            nb = 0;

            var charInData = false;

            // check if characteristic is already in the data array
            for (k = data.length - 1; k >= 0; k--) {
                var valueC = (characteristicValue!= null && characteristicValue.username != null)?
                                characteristicValue.username :
                                characteristicValue;
                if (data[k].name == valueC) {
                    charInData = true;
                }
            }

            // if it's a new characteristic:
            // count how many times it appear, calculate the avg, max and min
            if (!charInData) {

                totalTimeSpent = datasetAll[j].timeSpent;
                maxTimeSpent = datasetAll[j].timeSpent ;
                minTimeSpent = datasetAll[j].timeSpent ;
                nb = 1;
                for (var k = j - 1; k >= 0; k--) {
                    if (datasetAll[k][characteristic] == characteristicValue) {
                        // if there is a new gp
                        nb++;
                        timeS = datasetAll[k].timeSpent;
                        totalTimeSpent += timeS;
                        if (maxTimeSpent < timeS) {
                            maxTimeSpent = timeS;
                        }
                        if (minTimeSpent > timeS) {
                            minTimeSpent = timeS;
                        }
                    }
                }
                avgTimeSpent = Math.round(totalTimeSpent / nb);
                var valueC = (characteristicValue!= null && characteristicValue.username != null)?
                                characteristicValue.username :
                                characteristicValue;
                data[data.length] = {"name": valueC, "data": [avgTimeSpent/60, maxTimeSpent/60, minTimeSpent/60] };
            }
        }

        // add the total

        totalTimeSpent = 0;
        nb = 0;

        while (datasetAll.length > nb) {
            timeS = datasetAll[nb++].timeSpent;
            totalTimeSpent += timeS;
            if (maxTimeSpent < timeS) {
                maxTimeSpent = timeS;
            }
            if (minTimeSpent > timeS) {
                minTimeSpent = timeS;
            }
        }

        avgTimeSpent = Math.round(totalTimeSpent / nb);
        data[data.length] = {"name": "all", "data": [avgTimeSpent/60, maxTimeSpent/60, minTimeSpent/60] };

        */
        // draw bar chart
        data[data.length] = {"name": "all", "data": [
            countParamFirst*100/datasetFirst.length, 
            countParamLast*100/datasetLast.length, 
            countParamBest*100/datasetBest.length, 
            countParamAll*100/datasetAll.length] };
        return data;

    }

    function draw(element, characteristic, data, categories){
        element.highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: 'Detailed action (by ' + characteristic + ')'
            },
            xAxis: {
                categories: categories
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Selected (%)'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f} %</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.1,
                    borderWidth: 0
                }
            },
            series: data
        });
    }
    
    return {
        scope: {
            la: '=la',
            action: '=action',
            outcome: '=outcome',
            characteristic: '=characteristic',
            param: '=param'
        },
        link: function (scope, element) {
            var categories = ["First", "Last", "Best", "All"];
            scope.$watchGroup(['la', 'action', 'param', 'outcome', 'characteristic'], function (){
                var data = process(scope.la, scope.action, scope.param, scope.outcome, scope.characteristic, categories);
                draw(element, scope.characteristic, data, categories);
            });
        
        }
    };
});

learningAnalytics.directive('laCommonFeedback', function(utils){
    // set the view
    function process(la, type, outcome) {
        //var i, j, k, nb;

        //var totalTimeSpent, maxTimeSpent, minTimeSpent, timeS, avgTimeSpent;
        
        var dataset = utils.getGameplayDataset(la);
        var datasetFirst = utils.getPlayerFirstDataset(la);
        var datasetLast = utils.getPlayerLastDataset(la);
        var datasetBest = utils.getPlayerBestDataset(la, outcome);

        type = type.toUpperCase();

        if (dataset.length < 1) {
            return 0;
        }

        // find data to show in good format = json : { categories:[c1, c2, ...], series: [{name:"...", data:[n1, n2, ..., n6]}, ...] }
        var data;
        var categories = [];
        var series = [];
 
        var paramFirst = {};
        var paramLast = {};    
        var paramBest = {}; 
        var paramAll = {};   

        // look for params of action to sort by
        angular.forEach(dataset, function (d) {
            angular.forEach(d.feedback, function (feedback) {
                var f = feedback.feedback;
                var typeF = (f.type != null)? f.type : ((f.final != null)? "FINAL" : "no type");
                if (typeF === type || type === "ALL")
                {
                    if (paramAll[f.name] != null)
                    {
                        paramAll[f.name] += 1;
                        paramLast[f.name] = 0;
                        paramBest[f.name] = 0;
                        paramFirst[f.name] = 0;
                    }
                    else
                    {
                        paramAll[f.name] = 1;
                    }
                }
            });
        });

        // look for params of action in FIRST
        angular.forEach(datasetFirst, function (d) {
            angular.forEach(d.feedback, function (feedback) {
                var f = feedback.feedback;
                var typeF = (f.type != null)? f.type : ((f.final != null)? "FINAL" : "no type");
                if (typeF === type || type === "ALL")
                {
                    if (paramFirst[f.name] != null)
                    {
                        paramFirst[f.name] += 1;
                    }
                    else
                    {
                        paramFirst[f.name] = 1;
                    }
                }
            });
        });


        // look for params of action in LAST
        angular.forEach(datasetLast, function (d) {
            angular.forEach(d.feedback, function (feedback) {
                var f = feedback.feedback;
                var typeF = (f.type != null)? f.type : ((f.final != null)? "FINAL" : "no type");
                if (typeF === type || type === "ALL")
                {
                    if (paramLast[f.name] != null)
                    {
                        paramLast[f.name] += 1;
                    }
                    else
                    {
                        paramLast[f.name] = 1;
                    }
                }
            });
        });

        // look for params of action in BEST
        angular.forEach(datasetBest, function (d) {
            angular.forEach(d.feedback, function (feedback) {
                var f = feedback.feedback;
                var typeF = (f.type != null)? f.type : ((f.final != null)? "FINAL" : "no type");
                if (typeF === type || type === "ALL")
                {
                    if (paramBest[f.name] != null)
                    {
                        paramBest[f.name] += 1;
                    }
                    else
                    {
                        paramBest[f.name] = 1;
                    }
                }
            });
        });

        var array=[];

        for(p in paramAll){
         array.push([p.trim(),paramAll[p]]);
        }

        array.sort(function(a,b){return a[1] - b[1]});
        array.reverse();

        var title = type.toLowerCase().charAt(0).toUpperCase() + type.toLowerCase().slice(1) + " feedback triggered";

        var allSerieData = [];
        var firstSerieData = [];
        var lastSerieData = [];
        var bestSerieData = [];

        var i = 0;
        while ( i < array.length)
        {
            categories.push(array[i][0]);

            firstSerieData.push(paramFirst[array[i][0]] /datasetFirst.length);
            lastSerieData.push(paramLast[array[i][0]] /datasetLast.length);
            bestSerieData.push(paramBest[array[i][0]] /datasetBest.length);
            allSerieData.push(array[i][1] /dataset.length);

            i++;
        }

        firstSerie = {"name": "First", "data": firstSerieData};
        lastSerie = {"name": "Last", "data": lastSerieData};
        bestSerie = {"name": "Best", "data": bestSerieData};
        allSerie = {"name": "All", "data": allSerieData};
        series.push(firstSerie);
        series.push(lastSerie);
        series.push(bestSerie);
        series.push(allSerie);

        // draw bar chart
        data = {"categories": categories, "series": series, "title": title}
        return data;

    }

    function draw(element, data){
        element.highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: data.title
            },
            xAxis: {
                categories: data.categories
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'times triggered on average per gameplay'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.2f}</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.1,
                    borderWidth: 0
                }
            },
            series: data.series
        });
    }
    
    return {
        scope: {
            la: '=la',
            outcome: '=outcome',
            type: '=type'
        },
        link: function (scope, element) {
            scope.$watchGroup(['la', 'type', 'outcome'], function (){
                var data = process(scope.la, scope.type, scope.outcome);
                draw(element, data);
            });
        
        }
    };
});

learningAnalytics.directive('laBadges', function(utils){

    function process(la, characteristic) {
        var point;
        var dataset = la.players;

        if (dataset.length < 1) {
            return 0;
        }

        // find data to show in good format
        var series = [];

        var categories = [];
        var zeroCountBadges = [];

        for (b in dataset[0].badges)
        {
            categories.push(dataset[0].badges[b].name);
            zeroCountBadges.push(0);
        }
        // add one more to array to count number of player with characteristic
        zeroCountBadges.push(0);

        var zeroForAll = zeroCountBadges;

        var seriesCharacteristic = {"all": zeroForAll};

        // draw every line
        for (p in dataset) {
            //initialise score
            var player = dataset[p];
            var c = (characteristic == "student") ? "idPlayer" : characteristic;
            var characteristicValue = (characteristic == "student") ? utils.getUsernameById(la, player[c]) : player[c] ;
            var idP = player.idPlayer;


            if (seriesCharacteristic[characteristicValue] == null)
            {
                var newZeroElement = [];
                for (b in dataset[0].badges)
                {
                    newZeroElement.push(0);
                }
                newZeroElement.push(0);
                seriesCharacteristic[characteristicValue] = newZeroElement;
            }

            for (var i = 0; i < categories.length; i++)
            {
                for(b in player.badges)
                {
                    var badge = player.badges[b];
                    if (badge.name === categories[i] && badge.earned === true)
                    {
                        seriesCharacteristic[characteristicValue][i] ++;
                        seriesCharacteristic["all"][i] ++;
                    }
                }
            }
            // increment last element of array (i.e. the count of player with the characteristic)
            seriesCharacteristic[characteristicValue][categories.length] ++;
            seriesCharacteristic["all"][categories.length] ++;
        }

        var characteristicValues = Object.keys(seriesCharacteristic);

        for (var j=0 ; j < characteristicValues.length ; j++)
        {
            var characteristicValue = characteristicValues[j]
            var points = [];

            for (var i = 0 ; i < seriesCharacteristic[characteristicValue].length -1 ; i++)
            {
                points[i] = seriesCharacteristic[characteristicValue][i] * 100 / seriesCharacteristic[characteristicValue][categories.length];
            }
            series[series.length] = {
                "name": characteristicValue, 
                "data": points,
                "pointPlacement": 'on',
                "color": Highcharts.getOptions().colors[j % 10] 
            };
        }

        var data = {"categories": categories, "series":series}
        return data;
    }

    function draw(element, characteristic, data){
        // draw chart in containerLearningCurveBy + characteristic
        element.highcharts({
            chart: {
                polar: true,
                type: 'line'
            },

            title: {
                text: 'Badges earned by ' + characteristic,
                x: -80
            },

            pane: {
                size: '80%'
            },

            xAxis: {
                categories: data.categories,
                tickmarkPlacement: 'on',
                lineWidth: 0
            },

            yAxis: {
                gridLineInterpolation: 'polygon',
                lineWidth: 0,
                min: 0,
                max: 100
            },

            tooltip: {
                shared: true,
                pointFormat: '<span style="color:{series.color}">{series.name}: <b>{point.y:,.1f} %</b><br/>'
            },

            legend: {
                align: 'right',
                verticalAlign: 'top',
                y: 70,
                layout: 'vertical'
            },

            series: data.series
        });
    }
    
    return {
        scope: {
            la: '=la',
            characteristic: '=characteristic'
        },
        link: function (scope, element) {
            scope.$watchGroup(['la', 'characteristic'], function (){
                var data = process(scope.la, scope.characteristic);
                draw(element, scope.characteristic, data);
            });
        
        }
    };
});

learningAnalytics.directive('laBadgeDetailed', function(utils){

    function process(la, badge) {

        if (la.players.length < 1) {
            return 0;
        }

        // find data to show in good format
        var series = [];
        var earnedBy = [];
        var notEarnedBy = []; 

        // save who earned the badge
        for (p in la.players) {
            var player = la.players[p];

            for(b in player.badges)
            {
                var currentBadge = player.badges[b];
                if (currentBadge.name === badge)
                {
                    var username = utils.getUsernameById(la, player.idPlayer);
                    if (currentBadge.earned === true)
                    {
                        earnedBy.push(username);
                    }
                    else
                    {
                        notEarnedBy.push(username);
                    }
                }
            }
        }

        var percentEarned = earnedBy.length * 100 / (la.players.length);
        //series.push(percentEarned);
        var roundedPercent = Math.round(percentEarned * 100) / 100
        data = {"percent": roundedPercent, "earned": earnedBy, "not": notEarnedBy};
        return data;
    }

    function draw(element, data, badge){

        var listEarned = "";
        for (var i=0 ; i<data.earned.length ; i++)
        {
            listEarned += "<li>"+ data.earned[i] +"</li>";
        }

        var listNot = "";
        for (var i=0 ; i<data.not.length ; i++)
        {
            listNot += "<li>"+ data.not[i] +"</li>";
        }

        element.text("<div class=\"col-md-6\"><h5>Earned by ("+data.percent+"%):</h5>" +
            "<ul>"+listEarned+"</ul></div><div class=\"col-md-6\"><h5>Not earned by ("+ (100 - data.percent) +"%):</h5>" +
            "<ul>"+listNot+"</ul></div>");
    }
    
    return {
        scope: {
            la: '=la',
            badge: '=badge'
        },
        templateUrl: "badgeDetail.html",
        link: function (scope, element) {
            scope.$watchGroup(['la', 'badge'], function (){
                scope.result = process(scope.la, scope.badge);
                //draw(element, scope.result, scope.badge);
            });
        
        }
    };
});

learningAnalytics.controller('LA_controller',
    ['$scope', '$http', '$location', '$modal', function ($scope, $http, $location, $modal) {
        $scope.LA = {};
        var gameplays;
        var players;
        $scope.uniquePlayers = function () {
            var players = [];
            for (var i = $scope.LA.gameplays.length - 1; i >= 0; i--) {
                var alreadyIn = false;
                for (var j = players.length - 1; j >= 0; j--) {
                    if ($scope.LA.gameplays[i].idPlayer == players[j]) {
                        alreadyIn = true;
                    }
                }
                if (!alreadyIn) {
                    players[players.length] = $scope.LA.gameplays[i].idPlayer
                }
            }
            return players;
        }

        $scope.getFeedbackTypes = function()
        {
            var types = [];
            var feedbackMessages = Object.keys($scope.LA.game.feedback);
            for (feedback in feedbackMessages)
            {
                var f = $scope.LA.game.feedback[feedbackMessages[feedback]];
                var type = (f.type != null)? f.type : ((f.final != null)? "final" : "no type");
                if (types.indexOf(type) < 0)
                {
                    types.push(type);
                }
            }
            return types;
        }

        $scope.getParamsAction = function ()
        {
            var action = $scope.actionDetailedAction;
            var parameters = [];
            
            angular.forEach($scope.LA.gameplays, function (gp) {
                angular.forEach(gp.actions, function (a) {
                    if (a.action === action)
                    {
                        var params = Object.keys(a.parameters);
                        var p_toString = "";

                        angular.forEach(params, function (p) {
                            p_toString += "_" + a.parameters[p];
                        });

                        p_toString = p_toString.substring(1);

                        if (parameters.indexOf(p_toString) < 0)
                        {
                            parameters.push(p_toString);
                        }
                    }
                });
            });

            parameters.sort();
            return parameters;
        }

        $scope.getExtraCharacteristics = function () {
            if (!Object.getOwnPropertyNames($scope.LA).length){ return [] };
            var characteristics = angular.copy($scope.LA.game.playerCharacteristics);

            // if more than half the players are students, add "by student" option
            var count = 0;
            for (var i=0 ; i<$scope.LA.players.length ; i++)
            {
                if ($scope.LA.players[i].student != null)
                {
                    count++;
                }
            }
            if (count > $scope.LA.players.length/2)
            {
                characteristics.push("student");
            }

            return characteristics;
        }

        $scope.getActionList = function() {
            if (!Object.getOwnPropertyNames($scope.LA).length){ return [] };
            return Object.keys($scope.LA.game.evidenceModel);            
        }
        
        $scope.getLearningOutcomesList = function () {
            if (!Object.getOwnPropertyNames($scope.LA).length){ return [] };
            return Object.keys($scope.LA.game.learningOutcomes);
        }

        $scope.getSudentsWhoPlayed = function () {
           var students = [];
            for (i in players) 
            {
                if (players[i].student != null)
                {
                    students[students.length] = players[i];
                }
                else
                {
                    if (players[i].name != null)
                    {
                        var s = {"name": players[i].name, "id": players[i].idPlayer};
                        students[students.length] = players[i];
                    }
                    else if (players[i].username != null)
                    {
                        var s = {"name": players[i].username, "id": players[i].idPlayer};
                        students[students.length] = players[i];   
                    }
                    else if (players[i].firstname != null)
                    {
                        var s = {"name": players[i].firstname, "id": players[i].idPlayer};
                        students[students.length] = players[i];  
                    }              
                }
            }
            return students;
        }

        $scope.selectAllPlayers = function()
        {
            var students = $scope.getSudentsWhoPlayed();

            for (s in students)
            {
                students[s].selected = true;
            }
        }

        $scope.deselectAllPlayers = function()
        {
            var students = $scope.getSudentsWhoPlayed();

            for (s in students)
            {
                students[s].selected = false;
            }
        }

        $scope.filterGameplays = function() 
        {
            var filteredGameplays = angular.copy(gameplays);
            var filteredPlayers = angular.copy(players);

            var students = $scope.getSudentsWhoPlayed();

            for (i in filteredGameplays)
            {
                for (s in students)
                {
                    if (students[s].idPlayer == filteredGameplays[i].idPlayer
                            && !students[s].selected)
                    {
                        filteredGameplays.splice(i, 1);
                    }
                }
            }

            for (p in filteredPlayers)
            {
                for (s in students)
                {
                    if (students[s].idPlayer == filteredPlayers[p].idPlayer
                            && !students[s].selected)
                    {
                        filteredPlayers.splice(p, 1);
                    }
                }
            }

            $scope.LA.gameplays = angular.copy(filteredGameplays);
            $scope.LA.players = angular.copy(filteredPlayers);
            $scope.LA = angular.copy($scope.LA);
        }

        // Initialize the radio buttons

        $scope.whoPlayedView = 'gameplay';
        $scope.howLongView = 'total';
        $scope.whenView = 'gameplay';
        $scope.howManyTimesView = 'gameplay';
        $scope.finalScoresView = 'gameplay';
        $scope.learningCurvesView = 'gameplay';
        $scope.customView = 'gameplay';
        
        // Get the learning analytics
        var path = /learning_analytics\/(\d+)\/(\d+)\/(\d+)/.exec($location.absUrl());
        var extraTeacher = "";
        if (path[3] != 0)
        {
            extraTeacher = "/teacher/" + path[3];
        }


        $http.get('http://engage.yaellechaudy.com:8080/learninganalytics/seriousgame/' + path[1] + '/version/' + path[2] + extraTeacher)
        //$http.get('http://docker:8080/learninganalytics/seriousgame/' + path[1] + '/version/' + path[2])
            .success(function (data) {
                $scope.LA = data;
                gameplays = angular.copy($scope.LA.gameplays);
                players = angular.copy($scope.LA.players);
                // update the select boxes

                var listStudents = $scope.getSudentsWhoPlayed();
                for (i in listStudents)
                {
                    listStudents[i].selected = true;
                }
                var leargninOutcome =  $scope.getLearningOutcomesList()[0];
                $scope.loFinalScoresOutcome = leargninOutcome;
                $scope.loLearningCurvesOutcome = leargninOutcome;
                $scope.loLearningCurvesWithinGameplaysOutcome = leargninOutcome;
                $scope.loCommonActions = leargninOutcome;
                $scope.loDetailedAction = leargninOutcome;
                $scope.loCommonActionsBest = leargninOutcome;
                $scope.loCommonFeedack = leargninOutcome; 
                $scope.loFinalScoresBestOutcome = leargninOutcome; 
                $scope.loLearningCurveBestOutcome = leargninOutcome; 
                $scope.loCustomBestOutcome = leargninOutcome; 

                $scope.signLOCommonActions = "+";
                $scope.mostOrLeastCommon = "false";

                $scope.actionsCommonActions = $scope.getActionList()[0];
                $scope.actionDetailedAction = $scope.getActionList()[0];
                $scope.paramDetailedAction = $scope.getParamsAction()[0];

                $scope.typeFeedback = "All";

                $scope.badgeDetailed = $scope.LA.players[0].badges[0].name;

                // player report
                $scope.studentSelected = $scope.getSudentsWhoPlayedReport()[0].idPlayer;

                $scope.badges = true;
                $scope.nameBadges = true;
                $scope.messageBadges = true;
                $scope.progressBadges = false;
                $scope.compareBadges = false;
                $scope.percentEarnedBadge = true;

                $scope.numbers = true;
                $scope.timesPlayed = true;
                $scope.compareTimesPlayed = true;
                $scope.timesWon = true;
                $scope.compareTimesWon = true;
                $scope.timeSpent = true;
                $scope.compareTimeSpent = true;

                $scope.performance = true;
                $scope.finalScore = true;
                $scope.compareFinalScore = true;
                $scope.finalScoreScore = Object.keys($scope.LA.game.learningOutcomes)[0];
                $scope.finalScoreTitle = $scope.LA.game.learningOutcomes[$scope.finalScoreScore].desc;
                $scope.learningCurve = true;
                $scope.learningCurveScore = Object.keys($scope.LA.game.learningOutcomes)[0];
                $scope.commonActions = true;
                $scope.compareCommonActions = true;
                $scope.commonActionsLO = Object.keys($scope.LA.game.learningOutcomes)[0];
                $scope.commonActionsActions = $scope.getActionList()[0];
                $scope.commonActionsSign = "+";
                $scope.commonActionsTitle = "Your correct answers";
                $scope.commonActionsMostOrLeastCommon = "false";
                $scope.commonActionsBestLO = Object.keys($scope.LA.game.learningOutcomes)[0];
                $scope.commonActionsLimit = 8;
                $scope.commonActions2 = true;
                $scope.compareCommonActions2 = true;
                $scope.commonActionsLO2 = Object.keys($scope.LA.game.learningOutcomes)[0];
                $scope.commonActionsActions2 = $scope.getActionList()[0];
                $scope.commonActionsSign2 = "-";
                $scope.commonActionsTitle2 = "Your mistakes";
                $scope.commonActionsMostOrLeastCommon2 = "false";
                $scope.commonActionsBestLO2 = Object.keys($scope.LA.game.learningOutcomes)[0];
                $scope.commonActionsLimit2 = 8;
            });

        /**
         * Open Feedback modal. 
         */
        $scope.openFeedbackModal = function (idPlayer) {
            var modalInstance = $modal.open({
                templateUrl: 'myModalContent.html',
                controller: 'reportCtrl',
                size: 'lg',
                scope: $scope
            });
        };

        $scope.generate = function() {
                var printContents = document.getElementById("reportToPrint").innerHTML;
                var originalContents = document.body.innerHTML;

                document.body.innerHTML = printContents;

                window.print();

                document.body.innerHTML = originalContents;

                /*
                var printContents = document.getElementById("reportToPrint").innerHTML;
                 var popupWin = window.open('', '_blank', 'width=300,height=300');
                 popupWin.document.open()
                 popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + printContents + '</html>');
                 popupWin.document.close();
                */
        }

        $scope.getSudentsWhoPlayedReport = function () {
            var players = [];
            for (var i = $scope.LA.gameplays.length - 1; i >= 0; i--) {
                var alreadyIn = false;
                for (var j = players.length - 1; j >= 0; j--) {
                    if ($scope.LA.gameplays[i].idPlayer == players[j].idPlayer) {
                        alreadyIn = true;
                    }
                }
                if (!alreadyIn) {
                    players[players.length] = $scope.LA.gameplays[i];
                }
            }
            return players;
        }

        $scope.date = new Date();

        /* 
        * compares playerNum with class average
        * if above average + 10%  => return 1
        * if bellow average - 10%  => return -1
        * if bellow average/2 => return -2
        * else => return 0
        */
        $scope.compareToClass = function (average, playerNum) {
            var margin = 15 * average / 100;
            if (playerNum > average + margin)
            {
                return 1;
            }
            else if (playerNum < average/2)
            {
                return -2;
            }
            else if (playerNum < average - margin)
            {
                return -1;
            }
            return 0;
        }
        $scope.compareToClassBadges = function (average, playerEarned) {

            if (average > 49 && !playerEarned)
            {
                return -1;
            }
            if (average < 50 && playerEarned)
            {
                return 1;
            }
            return 0;
        }

        $scope.classAverage= function (badgeId) {
            var sumPlayerNum = 0;
            var numPlayers = $scope.LA.players.length;
            if (numPlayers == 0)
            {
                return 0;
            }
            for (var i = numPlayers - 1; i >= 0; i--) {
                for (var j = $scope.LA.players[i].badges.length - 1; j >= 0; j--) {
                    if ($scope.LA.players[i].badges[j].id === badgeId)
                    {
                        sumPlayerNum += $scope.LA.players[i].badges[j].playerNum;
                    }
                }
            }
            return parseInt(sumPlayerNum / numPlayers);
        }

        $scope.averageBadgesEarned= function (badgeId) {
            var playersWithBadge = 0;
            var numPlayers = $scope.LA.players.length;
            if (numPlayers == 0)
            {
                return 0;
            }
            for (var i = numPlayers - 1; i >= 0; i--) {
                for (var j = $scope.LA.players[i].badges.length - 1; j >= 0; j--) {
                    if ($scope.LA.players[i].badges[j].id === badgeId && $scope.LA.players[i].badges[j].earned)
                    {
                        playersWithBadge ++;
                    }
                }
            }
            return parseInt(playersWithBadge * 100 / numPlayers);
        }

        $scope.getNumberGameplays = function(idPlayer)
        {
            var gameplays = 0;
            for (var i = $scope.LA.gameplays.length - 1; i >= 0; i--) {
                if ($scope.LA.gameplays[i].idPlayer == idPlayer) {
                    gameplays ++;
                }
            }
            return gameplays;
        }

        $scope.getAverageNumberGameplays = function()
        {
            if ($scope.LA.players.length === 0)
            {
                return 0;
            }
            return parseInt($scope.LA.gameplays.length / $scope.LA.players.length);
        }

        $scope.getNumberGameplaysWon = function(idPlayer)
        {
            var gameplaysWon = 0;
            for (var i = $scope.LA.gameplays.length - 1; i >= 0; i--) {
                if ($scope.LA.gameplays[i].idPlayer == idPlayer && $scope.LA.gameplays[i].won) {
                    gameplaysWon ++;
                }
            }
            return gameplaysWon;
        }

        $scope.getAverageNumberGameplaysWon = function()
        {
            if ($scope.LA.players.length === 0)
            {
                return 0;
            }
            var gameplaysWon = 0;
            for (var i = $scope.LA.gameplays.length - 1; i >= 0; i--) {
                if ($scope.LA.gameplays[i].won) {
                    gameplaysWon ++;
                }
            }
            return parseInt(gameplaysWon / $scope.LA.players.length);
        }

        $scope.getTimeSpent = function(idPlayer)
        {
            var timeSpent = 0;
            for (var i = $scope.LA.gameplays.length - 1; i >= 0; i--) {
                if ($scope.LA.gameplays[i].idPlayer == idPlayer) {
                    timeSpent += $scope.LA.gameplays[i].timeSpent ;
                }
            }
            return parseInt(timeSpent/60);
        }

        $scope.getAverageTimeSpent = function()
        {
            if ($scope.LA.players.length === 0)
            {
                return 0;
            }
            var timeSpent = 0;
            for (var i = $scope.LA.gameplays.length - 1; i >= 0; i--) {
                timeSpent += $scope.LA.gameplays[i].timeSpent ;
            }
            return parseInt( (timeSpent/60) / $scope.LA.players.length);
        }

        $scope.Range = function(start, end) {
            var result = [];
            for (var i = start; i <= end; i++) {
                result.push(i);
            }
            return result;
        };

    }]
);

learningAnalytics.directive('reportFinalScores', function(utils){
    // set the view
    function process(la, outcome, formula, player, compare, title) {
        var idPlayer = player;
        // set the view
        var dataset = [];
        var i, j, k;
        dataset = la.gameplays;

        if (dataset.length < 1) {
            return 0;
        }

        // find data to show in good format = array of {name:"...", data:[avg, max, min]}
        var data = [];
        if (compare)
        {
            var categories = ["You", "The class", "Compare"];
        }
        else
        {
            var categories = ["You", "..."];            
        }

        var scoresListPlayer = [];
        var scoresListClass = [];

        // get value for student
        for (j = 0 ; j < dataset.length ; j++) {
            if (outcome === "_custom_")
            {
                scoresListClass[j] = utils.getValueForCustomFormula(dataset[j].finalScores, formula);
            }
            else
            {
                scoresListClass[j] = dataset[j].finalScores[outcome];
            }

            if (dataset[j].idPlayer == idPlayer)
            {
                if (outcome === "_custom_")
                {
                    var formulaParsed = utils.getValueForCustomFormula(dataset[j].finalScores, formula);
                    scoresListPlayer[scoresListPlayer.length] = formulaParsed;
                    var formulaParsed_tostring = formulaParsed + " ";
                    if (formulaParsed_tostring.match(/[a-z]/i))
                    {
                        return { data: null, categories: null, title: "error, score not found"};
                    }
                }
                else
                {
                    scoresListPlayer[scoresListPlayer.length] = dataset[j].finalScores[outcome];
                }
 
            }
        }

        data[0] = utils.getArrayStats(scoresListPlayer);
        if (compare)
        {
            data[1] = utils.getArrayStats(scoresListClass);
        }

        //var title = (outcome === "_custom_")? formula : la.game.learningOutcomes[outcome].desc;

        var minAverageMax = utils.getMinAverageMax(scoresListPlayer);

        // draw bar chart
        return { data: data, categories: categories, title: title, minAverageMax: minAverageMax};

    }

    function draw(element, data, categories, title, minAverageMax){
        element.highcharts({

                chart: {
                    type: 'boxplot'
                },

                title: {
                    text: 'Your score'
                },

                subtitle: {
                    text: title
                },

                legend: {
                    enabled: false
                },

                xAxis: {
                    categories: categories,
                    title: {
                        text: ''
                    }
                },

                yAxis: {
                    title: {
                        text: 'Score'
                    },
                    plotLines: [{
                        value: minAverageMax[1],
                        color: 'orange',
                        width: 2,
                        label: {
                            text: 'Your average',
                            align: 'right',
                            style: {
                                color: 'gray'
                            }
                        }
                    },
                    {
                        value: minAverageMax[2],
                        color: 'green',
                        width: 2,
                        label: {
                            text: 'Your highest score',
                            align: 'right',
                            style: {
                                color: 'gray'
                            }
                        }
                    },
                    {
                        value: minAverageMax[0],
                        color: 'red',
                        width: 2,
                        label: {
                            text: 'Your lowest score',
                            align: 'right',
                            style: {
                                color: 'gray'
                            }
                        }
                    }]
                },

                series: [{
                    name: 'Scores',
                    data: data,
                    tooltip: {
                        headerFormat: '<em>You within {point.key}</em><br/>'
                    }
                }, {
                    name: 'Your best',
                    color: Highcharts.getOptions().colors[0],
                    type: 'scatter',
                    data: [ // x, y positions where 0 is the first category
                        [data.length, minAverageMax[2]]
                    ],
                    marker: {
                        symbol: 'circle',
                        fillColor: 'grey',
                        lineWidth: 1,
                        lineColor: Highcharts.getOptions().colors[0]
                    },
                    tooltip: {
                        pointFormat: '<b>{point.y}</b>'
                    }
                }]

            });     
    /*
        element.highcharts({

            chart: {
                type: 'boxplot'
            },

            title: {
                text: 'Final score'
            },

            subtitle: {
                text: title
            },

            legend: {
                enabled: false
            },

            xAxis: {
                categories: categories
            },

            yAxis: {
                title: {
                    text: 'Score'
                },
                plotlines: [{
                        value: 1,
                        color: 'orange',
                        width: 2,
                        label: {
                            text: 'Your average',
                            align: 'right',
                            style: {
                                color: 'gray'
                            }
                        }
                    },
                    {
                        value: 2,
                        color: 'green',
                        width: 2,
                        label: {
                            text: 'Your highest score',
                            align: 'right',
                            style: {
                                color: 'gray'
                            }
                        }
                    },
                    {
                        value: 0,
                        color: 'red',
                        width: 2,
                        label: {
                            text: 'Your lowest score',
                            align: 'right',
                            style: {
                                color: 'gray'
                            }
                        }
                    }]
            },

            series: [
                {
                    name: 'Scores',
                    data: data,
                    tooltip: {
                        headerFormat: '<em>Score for {point.key}</em><br/>'
                    }
                }
            ]

        });
    */
    }
    
    return {
        scope: {
            la: '=la',
            outcome: '=outcome',
            player: '=player',
            formula: '=formula',
            compare: '=compare',
            title: '=title'
        },
        link: function (scope, element) {
            scope.$watchGroup(['la', 'outcome', 'formula', 'player', 'compare', 'title'], function (){
                var output = process(scope.la, scope.outcome, scope.formula, scope.player, scope.compare, scope.title);
                draw(element, output.data, output.categories, output.title, output.minAverageMax);
            });
        
        }
    };
});

learningAnalytics.directive('reportLearningCurve', function(utils){

    function process(la, outcome, formula, player) {
        var dataset = la.gameplays;

        if (dataset.length < 1) {
            return 0;
        }

        dataset.sort(utils.sortFunctionTimeStarted);

        var listScores = Object.keys($scope.LA.game.learningOutcomes);
        var players = [];
        // find data to show in good format
        var data = [];

        var tryNumber = 0;
        var points = [];

        // initialise score => starting value
        var point = [];
        point[0] = tryNumber;

        if (outcome === "_custom_")
        {
            var formula2 = formula + " ";
            listOutcomes = Object.keys(la.game.learningOutcomes);
            for (o in listOutcomes) {
                var outcome2 = la.game.learningOutcomes[listOutcomes[o]];

                formula2 = utils.replaceAll(listOutcomes[o], outcome2.value, formula2);
            }

            if (formula2.match(/[a-z]/i))
            {
                formula = "error, score not found";
                return null;
            }

            var formulaParsed = Parser.evaluate(formula2);

            point[1] = formulaParsed;                    
        }
        else
        {
            point[1] = la.game.learningOutcomes[outcome].value;
        }

        points[0] = point;

        // draw every line
        for (var j = 0 ; j < dataset.length ; j++) {

            if (dataset[j].idPlayer == player)
            {
                tryNumber++;
                point = [];
                point[0] = tryNumber;
                if (outcome === "_custom_")
                {
                    var pt1 = utils.getValueForCustomFormula(dataset[j].finalScores, formula);
                    point[1] = pt1;
                }
                else
                {
                    point[1] = dataset[j].finalScores[outcome];
                }

                points.push(point);
            }
        }
        
        data[data.length] = {"name": " ",
                "data": points
            };
        return data;
    }

    function draw(element, data, outcome, formula, la){
        var title = (outcome === "_custom_")? formula : la.game.learningOutcomes[outcome].desc;
        element.highcharts({
            title: {
                text: 'Learning curve',
                x: -20 //center
            },
            subtitle: {
                text: title,
                x: -20
            },
            xAxis: {
                title: {
                    text: 'number of gameplays'
                }
            },
            yAxis: {
                title: {
                    text: 'score'
                },
                plotLines: [
                    {
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }
                ]
            },
            tooltip: {
                headerFormat: '<b>{series.name} : {point.y}</b><br/>'
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: data
        });
    }
    
    return {
        scope: {
            la: '=la',
            outcome: '=outcome',
            player: '=player',
            formula: '=formula'
        },
        link: function (scope, element) {
            scope.$watchGroup(['la', 'player', 'outcome', 'formula'], function (){
                var data = process(scope.la, scope.outcome, scope.formula, scope.player);
                draw(element, data, scope.outcome, scope.formula, scope.la);
            });
        
        }
    };
});

learningAnalytics.directive('reportAllLearningCurves', function(utils){

    function process(la, formula, booleanformula, nameformula, player) {

        var dataset = la.gameplays;

        if (dataset.length < 1) {
            return 0;
        }

        dataset.sort(utils.sortFunctionTimeStarted);

        var listScores = Object.keys(la.game.learningOutcomes);

        // find data to show in good format
        var data = [];

        var tryNumber = 0;
        var pointsCustom = [];


        // initialise score => starting value

        if (booleanformula)
        {
            var point = [];
            point[0] = tryNumber;

            var formula2 = formula + " ";
            listOutcomes = Object.keys(la.game.learningOutcomes);
            for (o in listOutcomes) {
                var outcome2 = la.game.learningOutcomes[listOutcomes[o]];

                formula2 = utils.replaceAll(listOutcomes[o], outcome2.value,formula2);
            }

            if (formula2.match(/[a-z]/i))
            {
                nameFormula = "error, score not found";
                return null;
            }

            var formulaParsed = Parser.evaluate(formula2);

            point[1] = formulaParsed;     
            pointsCustom[0] = point;            
        }


        var pointsScores = {"_desc": "JSON with list of scores value for each score"};

        for (score in listScores)
        {
            var point = [];
            point[0] = tryNumber;
            point[1] = la.game.learningOutcomes[listScores[score]].value;

            var points = [];
            points[0] = point;

            pointsScores[listScores[score]] = points;
        }

        // draw every line
        for (var j = 0 ; j < dataset.length ; j++) {

            if (dataset[j].idPlayer == player)
            {
                tryNumber++;
                if (booleanformula)
                {
                    point = [];
                    point[0] = tryNumber;
                    point[1] = utils.getValueForCustomFormula(dataset[j].finalScores, formula);
                    pointsCustom.push(point);      
                }
                for (score in listScores)
                {
                    point = [];
                    point[0] = tryNumber;
                    point[1] = dataset[j].finalScores[listScores[score]];
                    pointsScores[listScores[score]].push(point);
                }
            }
        }
        
        for (score in listScores)
        {
            data[data.length] = {"name": la.game.learningOutcomes[listScores[score]].desc, "data": pointsScores[listScores[score]] };
        }
        if (booleanformula)
        {
            data[data.length] = {"name": nameformula, "data": pointsCustom };
        }
        return data;
    }

    function draw(element, data){
        element.highcharts({
            title: {
                text: 'Learning curve',
                x: -20 //center
            },
            subtitle: {
                text: "your performance over all your gameplays",
                x: -20
            },
            xAxis: {
                title: {
                    text: 'number of gameplays'
                }
            },
            yAxis: {
                title: {
                    text: 'score'
                },
                plotLines: [
                    {
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }
                ]
            },
            tooltip: {
                headerFormat: '<b>{series.name} : {point.y}</b><br/>'
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0,
                width: 150,
                itemStyle: {
                    width: 135 // or whatever
                }
            },
            series: data
        });
    }
    
    return {
        scope: {
            la: '=la',
            player: '=player',
            formula: '=formula',
            booleanformula: '=booleanformula',
            nameformula: '=nameformula'
        },
        link: function (scope, element) {
            scope.$watchGroup(['la', 'player', 'formula', 'booleanformula', 'nameformula'], function (){
                var data = process(scope.la, scope.formula, scope.booleanformula, scope.nameformula, scope.player);
                draw(element, data);
            });
        
        }
    };
});

learningAnalytics.directive('reportCommonActions', function(utils){
    // set the view
    function process(la, action, outcome, sign, leastcommon, bestoutcome, player, limit, title) {
        //var i, j, k, nb;

        //var totalTimeSpent, maxTimeSpent, minTimeSpent, timeS, avgTimeSpent;
        
        var dataset = utils.getGameplayDataset(la);
        var datasetFirst = utils.getPlayerFirstDataset(la);
        var datasetLast = utils.getPlayerLastDataset(la);
        var datasetBest = utils.getPlayerBestDataset(la, bestoutcome);

        if (dataset.length < 1) {
            return 0;
        }

        // find data to show in good format = json : { categories:[c1, c2, ...], series: [{name:"...", data:[n1, n2, ..., n6]}, ...] }
        var data;
        var categories = [];
        var series = [];
 
        var paramFirst = {};
        var paramLast = {};    
        var paramBest = {}; 
        var paramAll = {};   

        var countAll = 0;
        var countFirst = 0;
        var countBest = 0;
        var countLast = 0;  

        // look for params of action to sort by
        angular.forEach(dataset, function (d) {
            if (d.idPlayer == player)
            {
                countAll++;
                angular.forEach(d.actions, function (a) {
                    if (a.action === action)
                    {
                        if (a.outcome === outcome &&( (a.mark < 0 && sign === "-") || (a.mark >= 0 && sign === "+")) )
                        {
                            var params = Object.keys(a.parameters);
                            var p_toString = "";

                            angular.forEach(params, function (p) {
                                p_toString += "_" + a.parameters[p];
                            });

                            p_toString = p_toString.substring(1);

                            if (paramAll[p_toString] != null)
                            {
                                paramAll[p_toString] += 1;
                            }
                            else
                            {
                                paramAll[p_toString] = 1;
                                paramLast[p_toString] = 0;
                                paramBest[p_toString] = 0;
                                paramFirst[p_toString] = 0;
                            }
                        }
                    }
                });
            }
        });

        // look for params of action in FIRST
        angular.forEach(datasetFirst, function (d) {
            if (d.idPlayer == player)
            {
                countFirst++;
                angular.forEach(d.actions, function (a) {
                    if ((a.action === action) && (a.outcome === outcome &&( (a.mark < 0 && sign === "-") || (a.mark >= 0 && sign === "+")) ))
                    {
                        var params = Object.keys(a.parameters);
                        var p_toString = "";

                        angular.forEach(params, function (p) {
                            p_toString += "_" + a.parameters[p];
                        });

                        p_toString = p_toString.substring(1);

                        if (paramFirst[p_toString] != null)
                        {
                            paramFirst[p_toString] += 1;
                        }
                        else
                        {
                            paramFirst[p_toString] = 1;
                        }
                    }
                });
            }
        });


        // look for params of action in LAST
        angular.forEach(datasetLast, function (d) {
            if (d.idPlayer == player)
            {
                countLast++;
                angular.forEach(d.actions, function (a) {
                    if ((a.action === action) && (a.outcome === outcome &&( (a.mark < 0 && sign === "-") || (a.mark >= 0 && sign === "+")) ))
                    {
                        var params = Object.keys(a.parameters);
                        var p_toString = "";

                        angular.forEach(params, function (p) {
                            p_toString += "_" + a.parameters[p];
                        });

                        p_toString = p_toString.substring(1);

                        if (paramLast[p_toString] != null)
                        {
                            paramLast[p_toString] += 1;
                        }
                        else
                        {
                            paramLast[p_toString] = 1;
                        }
                    }
                });
            }
        });

        // look for params of action in BEST
        angular.forEach(datasetBest, function (d) {
            if (d.idPlayer == player)
            {
                countBest++;
                angular.forEach(d.actions, function (a) {
                    if ((a.action === action) && (a.outcome === outcome &&( (a.mark < 0 && sign === "-") || (a.mark >= 0 && sign === "+")) ))
                    {
                        var params = Object.keys(a.parameters);
                        var p_toString = "";

                        angular.forEach(params, function (p) {
                            p_toString += "_" + a.parameters[p];
                        });

                        p_toString = p_toString.substring(1);

                        if (paramBest[p_toString] != null)
                        {
                            paramBest[p_toString] += 1;
                        }
                        else
                        {
                            paramBest[p_toString] = 1;
                        }
                    }
                });
            }
        });

        var array=[];

        for(p in paramAll){
         array.push([p.trim(),paramAll[p]]);
        }

        array.sort(function(a,b){return a[1] - b[1]});

        var allSerieData = [];
        var firstSerieData = [];
        var lastSerieData = [];
        var bestSerieData = [];

        var i = 0;
        while ( i < limit && i < array.length)
        {
            categories.push(array[i][0]);
            
            firstSerieData.push(paramFirst[array[i][0]] * 100/countFirst);
            lastSerieData.push(paramLast[array[i][0]] * 100/countLast);
            bestSerieData.push(paramBest[array[i][0]] * 100/countBest);
            allSerieData.push(array[i][1] * 100/countAll);

            i++;
        }

        if (leastcommon == "false")
        {
            categories.reverse();
            firstSerieData.reverse();
            lastSerieData.reverse();
            bestSerieData.reverse();
            allSerieData.reverse();       
        }

        firstSerie = {"name": "First", "data": firstSerieData};
        lastSerie = {"name": "Last", "data": lastSerieData};
        bestSerie = {"name": "Best", "data": bestSerieData};
        allSerie = {"name": "All", "data": allSerieData};
        series.push(firstSerie);
        series.push(lastSerie);
        series.push(bestSerie);
        series.push(allSerie);

        // draw bar chart
        data = {"categories": categories, "series": series, "title": title}
        return data;

    }

    function draw(element, data){
        element.highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: data.title
            },
            xAxis: {
                categories: data.categories
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'selected (%)'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.2f} %</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.1,
                    borderWidth: 0
                }
            },
            series: data.series
        });
    }
    
    return {
        scope: {
            la: '=la',
            action: '=action',
            outcome: '=outcome',
            sign: '=sign',
            leastcommon: '=leastcommon',
            bestoutcome: '=bestoutcome',
            player: '=player',
            limit: '=limit',
            title: '=title'
        },
        link: function (scope, element) {
            scope.$watchGroup(['la', 'action', 'outcome', 'sign', 'leastcommon', 'bestoutcome', 'player', 'limit', 'title'], function (){
                var data = process(scope.la, scope.action, scope.outcome, scope.sign, scope.leastcommon, scope.bestoutcome, scope.player, scope.limit, scope.title);
                draw(element, data);
            });
        
        }
    };
});