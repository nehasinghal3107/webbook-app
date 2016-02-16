angular.module('apiIntegrationApp')
  .directive('prettyprint', function() {
    return {
        restrict: 'C',
        scope: {
          data: '='
        },
        link: function(scope, element, attrs) {
          element.text(vkbeautify.xml(scope.data, 4));
        }
    };
  })
  .directive('showtab',
    function() {
      return {
        link: function(scope, element, attrs) {
          element.click(function(e) {
            e.preventDefault();
            $(element).tab('show');
          });
        }
      };
    })
  .directive('appTooltip', function($compile, $timeout) {
    /* wrap in root element so we can get final innerHTML*/
    var tipTemplate = "<div><span ng-repeat='item in items'> {{item}}<span ng-show='!$last'>,</span> </span><div>";
    var getTemplate = function(contentType) {
      var template = '';
      switch (contentType) {
        case 'items':
          template = tipTemplate;
          break;
      }
      return template;
    }
    return {
      restrict: "A",
      transclude: true,
      template: "<span ng-transclude></span>",
      scope: {
        items: '='
      },
      link: function(scope, element, attrs) {
        var popOverContent;

        if (scope.items) {
          var html = getTemplate("items");
          popOverContent = $compile(html)(scope);
        }
        var options = {
          title: popOverContent,
          placement: "top",
          trigger: 'hover',
          container: 'body',
          html: true
        };
        $(element).tooltip(options);
      }
    };
  })

.directive('defPop',
    function() {

      return {
        restrict: 'EA',
        link: function(scope, element, attrs) {
          element.click(function(e) {
            $(function() {
              $('#example').popover({
                placement: 'bottom',
                html: true,
                container: 'body',
                content: function() {
                  return $('#popoverContent').html();
                },
                title: "<p style='letter-spacing:1px; font-size:15px; font-weight:600; color:rgb(137, 128, 30);font-style:italic;margin:0px;padding:2px;'> Notifications </p> "
              });
            })
          });
        }
      };
    })
  .directive('linkToggle',
    function() {
      return {
        link: function(scope, element, attrs) {
          element.click(function(e) {
            e.preventDefault();
            if ($('#app-list-group-item').hasClass('active')) {
              element.removeClass('active');
            } else {
              element.addClass('active');
            }
          });
        }
      };
    })
  .directive('sidePrimaryNav',
    function() {
      return {
        link: function(scope, element, attrs) {

          $('ul.nav.nav-sidebar li.primary').click(function() {
            var active_li = $('ul.expense-menu li.active').text();
            var li_group = $(this).data('li-group');
            if ($('ul.nav.nav-sidebar li.secondary[data-li-group=' + li_group + ']:first').css('display') == 'none') {
              $('ul.nav.nav-sidebar li.secondary').removeClass('active');
              $('ul.nav.nav-sidebar li.secondary').fadeOut();
              $('ul.nav.nav-sidebar li.secondary[data-li-group=' + li_group + ']').each(
                function() {
                  if (this.innerText == active_li) {
                    $(this).addClass('active');
                  };
                });
              $('ul.nav.nav-sidebar li.secondary[data-li-group=' + li_group + ']').fadeIn();
            }
          });
        }
      };
    })
  .directive('sideSecondaryNav',
    function() {
      return {
        link: function(scope, element, attrs) {
          $('ul.nav.nav-sidebar li.secondary').click(function() {
            $('ul.nav.nav-sidebar li.secondary').removeClass('active');
            var current_li = $(this).text().toUpperCase();
            $('ul.expense-menu li.active').removeClass('active');
            $("ul.expense-menu li").each(
              function() {
                if (this.innerText == current_li) {
                  $(this).addClass('active');
                };
              });
            $(this).addClass('active');
          });
        }
      };
    })
  .directive('ngEnter', function() {
    return function(scope, element, attrs) {
      element.bind("keydown keypress", function(event) {
        if (event.which === 13) {
          scope.$apply(function() {
            scope.$eval(attrs.ngEnter);
          });

          event.preventDefault();
        }
      });
    };
  })
  .directive('datepickerLocaldate', ['$parse', function($parse) {
    var directive = {
      restrict: 'A',
      require: ['ngModel'],
      link: link
    };
    return directive;

    function link(scope, element, attr, ctrls) {
      var ngModelController = ctrls[0];

      // called with a JavaScript Date object when picked from the datepicker
      ngModelController.$parsers.push(function(viewValue) {
        // undo the timezone adjustment we did during the formatting
        viewValue.setMinutes(viewValue.getMinutes() - viewValue.getTimezoneOffset());
        // we just want a local date in ISO format
        return viewValue.toISOString().substring(0, 10);
      });

      // called with a 'yyyy-mm-dd' string to format
      ngModelController.$formatters.push(function(modelValue) {
        if (!modelValue) {
          return undefined;
        }
        // date constructor will apply timezone deviations from UTC (i.e. if locale is behind UTC 'dt' will be one day behind)
        var dt = new Date(modelValue);
        // 'undo' the timezone offset again (so we end up on the original date again)
        dt.setMinutes(dt.getMinutes() + dt.getTimezoneOffset());
        return dt;
      });
    }
  }])
  .directive('popOver', function($compile, $state, GlobalAuthService, blockUI, growl, $rootScope) {
    var itemsTemplate = "<div ng-show='items.length === 0 && n.length === 0' role='tabpanel'>" +
      "<div class='no-data' style='letter-spacing:1px; font-size:12px; font-weight:500;'>" +
      "<p class='text-info' style='margin:2px;'>You have 0 dispatch pending requests to view/approve. </p>" +
      "</div>" + "</div>" + "<div ng-show='items.length !== 0 || n.length !== 0' role='tabpanel'>" +
      "<ul class='nav nav-tabs nav-justified' role='tablist'>" +
      "<li style='letter-spacing:1px; font-size:12.5px; font-weight:600;text-transform:uppercase;padding:2px;' role='presentation' class='active'><a href='' data-target='#pending' aria-controls='home' role='tab' data-toggle='tab'>Pending Approvals</a></li>" +
      "<li style='letter-spacing:1px; font-size:12.5px; font-weight:600;text-transform:uppercase;padding:2px;' role='presentation'><a href='' data-target='#defaulters' aria-controls='profile' role='tab' data-toggle='tab'>Accept Pickups</a></li>" +
      "</ul>" +
      "<br>" +
      "<div class='tab-content' style='letter-spacing:1px; font-size:12px; font-weight:500;'>" +
      "<div role='tabpanel' class='tab-pane active' id='pending'>" +
      "<div ng-show='items.length !== 0'>" +
      "<p style='margin:2px;' ng-repeat='item in items | limitTo:10'> Dispatch <b>{{item.id}}</b> for <b>{{item.package_count}}</b> packages of routes (<span ng-repeat='(key, value) in item.dispatch.routes'>{{key}}<span ng-show='!$last'>, </span></span>) by {{item.employee.firstname}} is sent for approval. <span class='pull-right'><button class='btn btn-xs btn-success' ng-click='approve_dispatch(item.id)'>Approve</button></span></p> " +
      "</div>" +
      "<div ng-show='items.length === 0'>" +
      "<p class='text-success text-center' style='margin:2px; font-size:14px;'>You have approved all the requests, <b>Good Job!</b>.</p> " +
      "</div>" +
      "</div>" +
      "<div ng-show='n.length !== 0' role='tabpanel' class='tab-pane' id='defaulters'>" +
      "<p ng-show='n.length > 1' style='margin:2px;'>Cash and pickup packages added [{{n.length}}] <span class='pull-right'><button class='btn btn-xs btn-success' ng-click='assignRoutes(n)'>Accept</button></span></p> " +
      "<p ng-show='n.length == 1' style='margin:2px;'>Cash and pickup package added [{{item.wbn}}] <span class='pull-right'><button class='btn btn-xs btn-success' ng-click='assignRoutes(n)'>Accept</button></span></p> " +
      "</div>" +
      "</div>" +
      "</div>";
    var getTemplate = function(contentType) {
      var template = '';
      switch (contentType) {
        case 'items':
          template = itemsTemplate;
          break;
      }
      return template;
    }
    return {
      restrict: "A",
      transclude: true,
      template: "<span ng-transclude></span>",
      scope: {
        items: '=',
        n: '='
      },
      link: function(scope, element, attrs) {
        var popOverContent;

        scope.approve_dispatch = function(id) {
          $(element).popover('hide');
          $state.transitionTo('app.view.approvedispatch', {
            "data": id
          });
        }

        scope.assignRoutes = function(packages) {
          $(element).popover('hide');
          blockUI.start();
          blockUI.message("Assiging Route");
          var ref = GlobalAuthService.getCenterRef();
          GlobalAuthService.getRoutingCriteria().then(function(data) {
            switch (data.routingCriteria) {
              case "locality":
                var localities = data.localities;
                angular.forEach(packages, function(pkg) {
                  var selectedRoute = localities[pkg.locality];
                  if (selectedRoute) {
                    ref.child("packages/pkg_scheduled/" + pkg.wbn).update({
                      "selected_route": selectedRoute
                    });
                    var scan = {};
                    scan.epoch_time = new Date().getTime();
                    scan.timestamp = new Date().toISOString().replace('Z', '');
                    scan.route = localities[pkg.locality];
                    scan.nslcode = "X-IBD3F";
                    scan.scanned_by = $rootScope.userdata.uid;
                    ref.child("packages/pkg_scheduled/" + pkg.wbn + "/scans/s1").update(retry);

                  }
                });
                blockUI.stop();
                break;
              case "pincode":
                var pincodes = data.pincodes;
                angular.forEach(packages, function(pkg) {
                  var selectedRoute = pincodes[pkg.locality];
                  if (selectedRoute) {
                    ref.child("packages/pkg_scheduled/" + pkg.wbn).update({
                      "selected_route": selectedRoute
                    });
                    var scan = {};
                    scan.epoch_time = new Date().getTime();
                    scan.timestamp = new Date().toISOString().replace('Z', '');
                    scan.route = localities[pkg.locality];
                    scan.nslcode = "X-IBD3F";
                    scan.scanned_by = $rootScope.userdata.uid;
                    ref.child("packages/pkg_scheduled/" + pkg.wbn + "/scans/s1").push(retry);
                  }
                });
                blockUI.stop();
                break;
            }
          }, function(error) {
            blockUI.stop();
            growl.addErrorMessage(error.message);

          });
        }

        if (scope.items) {
          var html = getTemplate("items");
          popOverContent = $compile(html)(scope);
        }
        var options = {
          content: popOverContent,
          placement: "bottom",
          trigger: 'click',
          container: 'body',
          html: true,
          title: "<p style='letter-spacing:1px; font-size:15px; font-weight:600; color:rgb(137, 128, 30);font-style:italic;margin:0px;padding:2px;'> Notifications </p> "
        };
        $(element).popover(options);

        $('body').on('click', function(e) {
          $('[data-toggle="popover"]').each(function() {
            //the 'is' for buttons that trigger popups
            //the 'has' for icons within a button that triggers a popup
            if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
              $(this).popover('hide');
            }
          });
        });
      }
    };
  })
  .directive('toolTip',
    function() {
      return {
        link: function(scope, element, attrs) {
          $(element).tooltip();
        }
      };
    })
  .directive('donutChart', function() {
    function link(scope, el, attr) {
      var color = d3.scale.category10();
      var width = 200;
      var height = 200;
      var min = Math.min(width, height);
      var svg = d3.select(el[0]).append('svg');
      var pie = d3.layout.pie().sort(null);
      var arc = d3.svg.arc()
        .outerRadius(min / 2 * 0.9)
        .innerRadius(min / 2 * 0.5);

      svg.attr({
        width: width,
        height: height
      });

      // center the donut chart
      var g = svg.append('g')
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

      // add the <path>s for each arc slice
      var arcs = g.selectAll('path');

      scope.$watch('data', function(data) {
        if (!data) {
          return;
        }
        arcs = arcs.data(pie(data));
        arcs.exit().remove();
        arcs.enter().append('path')
          .style('stroke', 'white')
          .attr('fill', function(d, i) {
            return color(i)
          });
        // update all the arcs (not just the ones that might have been added)
        arcs.attr('d', arc);
      }, true);
    }
    return {
      link: link,
      restrict: 'E',
      scope: {
        data: '='
      }
    };
  })
  .directive('myDraggable', ['$document', function($document) {
    return {
      link: function(scope, element, attr) {
        var startX = 0,
          startY = 0,
          x = 0,
          y = 0;

        element.css({
          position: 'relative',
          // border: '1px solid red',
          // backgroundColor: 'lightgrey',
          cursor: 'pointer'
        });

        element.on('mousedown', function(event) {
          // Prevent default dragging of selected content
          event.preventDefault();
          startX = event.pageX - x;
          startY = event.pageY - y;
          $document.on('mousemove', mousemove);
          $document.on('mouseup', mouseup);
        });

        function mousemove(event) {
          y = event.pageY - startY;
          x = event.pageX - startX;
          element.css({
            top: y + 'px',
            left: x + 'px'
          });
        }

        function mouseup() {
          $document.off('mousemove', mousemove);
          $document.off('mouseup', mouseup);
        }
      }
    };
  }])
  .directive("ddDraggable", function() {
    return {
      restrict: "A",
      link: function(scope, element, attributes, ctlr) {
        element.attr("draggable", true);

        element.bind("dragstart", function(eventObject) {
          eventObject.originalEvent.dataTransfer.setData("text", attributes.itemid);
        });
      }
    };
  })
  .directive("ddDropTarget", function() {
    return {
      restrict: "A",
      link: function(scope, element, attributes, ctlr) {

        element.bind("dragover", function(eventObject) {
          eventObject.preventDefault();
        });

        element.bind("drop", function(eventObject) {

          // invoke controller/scope move method
          scope.moveToBox(parseInt(eventObject.originalEvent.dataTransfer.getData("text")));

          // cancel actual UI element from dropping, since the angular will recreate a the UI element
          eventObject.preventDefault();
        });
      }
    };
  });

