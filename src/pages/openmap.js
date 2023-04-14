
import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, Popup ,useMapEvents, useMap} from 'react-leaflet';
import React, {useEffect, useState} from "react";
import L from 'leaflet';
import SlidePanel from './slidingpanel';
import Panel   from './panel';
import axios from 'axios';
import { keys } from '@mui/system';

let obj;
function Map() {
  const [location, setLocation] = useState({ lat: 9.102308613438732, lng: 76.49512052536011 });
  const [markerPosition  , setMarkerPositions] = useState({lat:0,lng:0})
  const [recievedPositions, setRecievedPositions] = useState([])
  const [booleanforcentermarker, setcentermarker] = useState(false)
  const [showMenu, setShowMenu] = useState(false);
  const [menuX, setMenuX] = useState(0);
  const [menuY, setMenuY] = useState(0);
  function LocationFinderDummy ({handleClick}) {   
      var map = useMap()
      var center = map.getCenter()
      if (booleanforcentermarker){
      return (
        <>
            <Marker position={center} draggable={true}/>
        </>
      );
      }
  };

  function Markeronclick () {
           useMapEvents({
        click(e) {
          console.log(e)
          console.log(e.originalEvent.button)
          if (e.originalEvent.button == 0 && e.originalEvent.ctrlKey == true) {
            var postcontent = e.latlng
            setMarkerPositions(e.latlng)
            console.log(postcontent)
            const config = {
              headers: {
                lat:postcontent.lat,
                long:postcontent.lng,
              }
            }
            axios.post('https://django.biscuitbobby.me/eventupdate/',{},config).then(response =>  {
              console.log(response.data)
            })
            .catch(error => {console.error(error)});
          }
 
        },
      });
      return(
      <>
      <Marker  position={markerPosition} draggable={true}></Marker>
      </>
      )
  }
  
  const loadMarkers = (e) => {
  axios.get('https://django.biscuitbobby.me/loc/')
  .then(response => {
    obj = JSON.parse(response.data)
    const newPostitions = []
    var eventdetails = []
    // for (var key in obj) {
    //   newPostitions.push({lat:obj[key].lat,lng:obj[key].lng})
    // }
    setRecievedPositions(obj)
    console.log(obj)
  })
  .catch(error => {
    console.log(error);
  });
  }

  const handleClick = (e) => {
    e.stopPropagation()
    setcentermarker(true)
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  },[]);

  function handleContextmenu(e) {
    e.preventDefault();
    setShowMenu(true);
    setMenuX(e.clientX);
    setMenuY(e.clientY);
  }

    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
    iconUrl: require('./blue.png'),
    iconRetinaUrl: require('./blue.png'),
    iconSize: new L.Point(30,70),
    shadowUrl: null,
    shadowSize: new L.point(30,50),
    shadowAnchor: null,
    });

    const Foodicon = new L.icon({
      iconUrl: require('./lightblue.png'),
      iconRetinaUrl: require('./lightblue.png'),
      iconSize: new L.Point(30,70),
      shadowUrl: null,
      shadowSize: new L.point(30,50),
      shadowAnchor: null,
    });

    const Shoppingicon = new L.icon({
      iconUrl: require('./orange.png'),
      iconRetinaUrl: require('./orange.png'),
      iconSize: new L.Point(30,70),
      shadowUrl: null,
      shadowSize: new L.point(30,50),
      shadowAnchor: null,
    });
    
    const Sporticon = new L.icon({
      iconUrl: require('./blue.png'),
      iconRetinaUrl: require('./blue.png'),
      iconSize: new L.Point(30,70),
      shadowUrl: null,
      shadowSize: new L.point(30,50),
      shadowAnchor: null,
    });
    function filterfood() {
      var foodlist = []
      for (var i in obj) {
        if (obj[i].tag == 'food') {
          foodlist.push(obj[i])
        }
      console.log('filetered')
      setRecievedPositions(foodlist)
      }
    }
    function filtershopping() {
      var foodlist = []
      for (var i in obj) {
        if (obj[i].tag == 'shopping') {
          foodlist.push(obj[i])
        }
      console.log('filetered')
      setRecievedPositions(foodlist)
      }
    }
    function filtersport() {
      var foodlist = []
      for (var i in obj) {
        if (obj[i].tag == 'sport') {
          foodlist.push(obj[i])
        }
      console.log('filetered')
      setRecievedPositions(foodlist)
      }
    }
  return (
    <div onContextMenu={handleContextmenu}>
    <SlidePanel handleClick={handleClick}/>
    <Panel filterfood={filterfood} filtershopping={filtershopping} filtersport={filtersport} filer/>
    <MapContainer style={{ height: "100vh", minHeight: "100%" }} center={[location.lat,location.lng]} zoom={13} minZoom={3} scrollWheelZoom={true} whenReady={loadMarkers}>

    {Object.keys(recievedPositions).map((keys,index) => {
      console.log(recievedPositions[keys].tag)
      switch(recievedPositions[keys].tag){
        case ('food'):
      return (
        <Marker key={index} position={[recievedPositions[keys].lat,recievedPositions[keys].lng]} icon={Foodicon}>
          <Popup>
            <div>
              <div className='eventTitle'>{recievedPositions[keys].event_name}</div>
              <div className='eventDescription'>{recievedPositions[keys].event_description}</div>
              <div className='eventButtonFlex'>
                <div className='eventButton'>View</div>
              </div>
            </div>
          </Popup>
        </Marker>
      )
      case('shopping'):
      return (
        <Marker key={index} position={[recievedPositions[keys].lat,recievedPositions[keys].lng]} icon={Shoppingicon}>
        <Popup>
          <div>
            <div className='eventTitle'>{recievedPositions[keys].event_name}</div>
            <div className='eventDescription'>{recievedPositions[keys].event_description}</div>
            <div className='eventButtonFlex'>
              <div className='eventButton'>View</div>
            </div>
          </div>
        </Popup>
      </Marker>
      )
      case('sport'):
      return(
        <Marker key={index} position={[recievedPositions[keys].lat,recievedPositions[keys].lng]} icon={Sporticon}>
        <Popup>
          <div>
            <div className='eventTitle'>{recievedPositions[keys].event_name}</div>
            <div className='eventDescription'>{recievedPositions[keys].event_description}</div>
            <div className='eventButtonFlex'>
              <div className='eventButton'>View</div>
            </div>
          </div>
        </Popup>
      </Marker>
      )
    }
  }
    )}
      <Markeronclick/>
      <LocationFinderDummy/>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    </MapContainer> 
    </div>
  );
}

export default Map;