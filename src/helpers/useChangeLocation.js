import {useCallback, useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {io} from 'socket.io-client';
import {getUniqueId} from 'react-native-device-info';
import {getAllUserByDevice} from 'app-redux/actions/app/app.actions';
const useChangeLocation = () => {
  const socket = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    socket.current = io('http://192.168.151.38:8080/');
    socket.current.emit('addUser', getUniqueId());

    socket.current.on('confirmedScanned', () => {
      dispatch(getAllUserByDevice(getUniqueId()));
    });
    return () => {
      socket.current.disconnect();
    };
    // eslint-disable-next-line
  }, []);

  const sendDeviceLocation = useCallback(
    (uniqueDeviceId, position, motion) => {
      const data = {
        uniqueDeviceId,
        position,
      };
      console.log(data);
      socket.current.emit('position', data);
    },
    // eslint-disable-next-line
    [],
  );

  const sendNotification = useCallback(
    notification => {
      const data = {
        uniqueDeviceId: getUniqueId(),
        notification,
      };
      console.log(data);
      socket.current.emit('notification', data);
    },
    // eslint-disable-next-line
    [],
  );

  return {sendDeviceLocation, sendNotification};
};

export default useChangeLocation;
