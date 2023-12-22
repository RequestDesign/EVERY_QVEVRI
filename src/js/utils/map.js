if (document.querySelectorAll('[data-map]').length) {
  document.querySelectorAll('[data-map]').forEach(mapEl => {
    window.map = null;

    async function initMap() {
      await ymaps3.ready;

      const LOCATION = {
        center:
          window.innerWidth > 768
            ? [30.29070872801772, 59.96487327442857]
            : [30.285804994973198, 59.96628435583354],
        zoom: 15,
      };
      const PIN_LOCATION = {
        center: [30.286780500000003, 59.96677256415152],
        zoom: 15,
      };

      const {
        YMap,
        YMapDefaultSchemeLayer,
        YMapDefaultFeaturesLayer,
        YMapMarker,
      } = ymaps3;

      const map = new YMap(
        mapEl,

        { location: LOCATION, behaviors: ['drag'] }
      );

      map.addChild(new YMapDefaultSchemeLayer());
      map.addChild(new YMapDefaultFeaturesLayer());

      const el = document.createElement('img');
      el.className = 'marker';
      el.src = '../app/img/icons/pin.svg';
      el.onclick = () =>
        map.update({ location: { ...PIN_LOCATION, duration: 400 } });
      map.addChild(new YMapMarker({ coordinates: PIN_LOCATION.center }, el));
    }
    initMap();
  });
}
