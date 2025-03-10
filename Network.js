import { fetch } from "@react-native-community/netinfo";

export const handleNewtwork = async () => {
    try{
        const isConnected = await fetch().then(state => {
            return state.isConnected;
          });

          const isInternetReachable = await fetch().then(state => {
            return state.isInternetReachable;
          })
          return {
            isConnected, isInternetReachable
          }

    }catch(error) {
         return false;
    }
}
