import { shallowMount } from '@vue/test-utils'
import DestinationList from '@/components/DestinationList.vue'
import DestinationComponent from '@/components/Destination.vue'
import { Destination } from '@/utils/triproute'

describe('DestinationList.vue', () => {
    it('renders destinations when passed a list of Destination objects', () => {
        const dest: Destination = {
            "name": "testDest",
            "latitude": 38.9486650738765,
            "longitude": -77.01459411621002,
            "notes": "hello world",
            "fromDate": "01-01-2020",
            "toDate": "01-05-2020",
            "images": [] as string[],
            "routeColor": "#888"
        };
	
        const wrapper = shallowMount(DestinationList, {
            props: {
                listOfDest: [dest],
            }
        });
        
        expect(wrapper.findAll("ul").length).toBe(1);
	
        // make sure 1 destination is there
        const destinations = wrapper.findAllComponents(DestinationComponent);
        expect(destinations.length).toBe(1);
    });
  
})
