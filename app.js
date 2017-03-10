(function() {
	'use strict';

	angular.module('NarrowItDownApp', [])
		.controller('NarrowItDownController', NarrowItDownController)
		.service('MenuSearchService', MenuSearchService)
		.directive('foundItems', foundItems)
		;

	NarrowItDownController.$inject = ['MenuSearchService'];

	function NarrowItDownController(MenuSearchService){
		var ndown = this;
		ndown.term = '';
		// keep the list null to start with
		ndown.found;

		// if the user clicks the search with nothing
		// in the search field just clear the list
		ndown.search = function(term){
			if (term.length > 0){
				MenuSearchService.getMatchedMenuItems(term)
					.then(function(found){
					ndown.found = found;
				});
			} else {
				ndown.found = [];
			}
		}
		
		ndown.remove = function(index){
			ndown.found.splice(index, 1);
		}
	}

	MenuSearchService.$inject = ['$http'];
	function MenuSearchService($http){
		var service = this;

		var menu_items_url = 'https://davids-restaurant.herokuapp.com/menu_items.json';
		
		service.getMatchedMenuItems = function(searchTerm){
			var re = new RegExp(searchTerm, 'i');

			return $http.get(menu_items_url).then(function (result) {
			    // process result and only keep items that match
			    var foundItems = result.data.menu_items.filter(function(item){
			    	return re.test(item.description);
			    });

			    // return processed items
			    return foundItems;
			});
		}
	}

	function foundItemDirectiveController(){
		var list = this;

		list.emptyList = function(){
			return list.items && list.items.length==0;
		}
	}

	function foundItems(){
		return {
			restrict: 'E',
			scope: {
				items: '<',
				onRemove: '&',
			},
			templateUrl: 'foundItems.html',
			controller: foundItemDirectiveController,
			controllerAs: 'list',
			bindToController: true
		};
	}
	
})();