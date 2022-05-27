import {uniq} from 'lodash';
import {useCallback, useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {io} from 'socket.io-client';
const useChangeLocation = () => {
  const socket = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    socket.current = io('http://192.168.151.38:8080/');
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

  return sendDeviceLocation;
};

export default useChangeLocation;
