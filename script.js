ymaps.ready(init);
function init(){
     // Стоимость за километр.
     var DELIVERY_TARIFF = 20;
     // Минимальная стоимость.
         MINIMUM_COST = 500;
    let myMap = new ymaps.Map('map-test', {
        center : [53.22948771078653,50.201084375305086],
        zoom : 12,
        controls: []
    });
     // Создадим панель маршрутизации.
     routePanelControl = new ymaps.control.RoutePanel({
        options: {
            // Добавим заголовок панели.
            showHeader: true,
            title: 'Расчёт Поездки'
        }
    }),
    zoomControl = new ymaps.control.ZoomControl({
        options: {
            size: 'small',
            float: 'none',
            position: {
                bottom: 145,
                right: 10
            }
        }
    });
// Пользователь сможет построить только автомобильный маршрут.
routePanelControl.routePanel.options.set({
    types: {auto: true}
});

// Если вы хотите задать неизменяемую точку "откуда", раскомментируйте код ниже.
/*routePanelControl.routePanel.state.set({
    fromEnabled: false,
    from: 'Москва, Льва Толстого 16'
 });*/

myMap.controls.add(routePanelControl).add(zoomControl);

// Получим ссылку на маршрут.
routePanelControl.routePanel.getRouteAsync().then(function (route) {

    // Зададим максимально допустимое число маршрутов, возвращаемых мультимаршрутизатором.
    route.model.setParams({results: 1}, true);

    // Повесим обработчик на событие построения маршрута.
    route.model.events.add('requestsuccess', function () {

        var activeRoute = route.getActiveRoute();
        if (activeRoute) {
            // Получим протяженность маршрута.
            var length = route.getActiveRoute().properties.get("distance"),
            // Вычислим стоимость доставки.
                price = calculate(Math.round(length.value / 1000)),
            // Создадим макет содержимого балуна маршрута.
                balloonContentLayout = ymaps.templateLayoutFactory.createClass(
                    '<span>Расстояние: ' + length.text + '.</span><br/>' +
                    '<span style="font-weight: bold; font-style: italic">Стоимость Поездки: ' + price + ' р.</span>');
            // Зададим этот макет для содержимого балуна.
            route.options.set('routeBalloonContentLayout', balloonContentLayout);
            // Откроем балун.
            activeRoute.balloon.open();
        }
    });

});
// Функция, вычисляющая стоимость доставки.
function calculate(routeLength) {
    return Math.max(routeLength * DELIVERY_TARIFF, MINIMUM_COST);
}
}
//     map.controls.remove('geolocationControl'); // удаляем геолокацию
//   map.controls.remove('searchControl'); // удаляем поиск
//   map.controls.remove('trafficControl'); // удаляем контроль трафика
//   map.controls.remove('typeSelector'); // удаляем тип
//   map.controls.remove('fullscreenControl'); // удаляем кнопку перехода в полноэкранный режим
//   map.controls.remove('zoomControl'); // удаляем контрол зуммирования
//   map.controls.remove('rulerControl'); // удаляем контрол правил
//   map.behaviors.disable(['scrollZoom']); // отключаем скролл карты (опционально)


