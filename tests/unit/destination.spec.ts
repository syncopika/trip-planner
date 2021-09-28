import { shallowMount } from '@vue/test-utils'
import DestinationComponent from '@/components/Destination.vue'
import { Destination } from '@/triproute'

// TODO: not test implementation details
describe('Destination.vue', () => {
  it('renders destination info when passed a Destination object', () => {
	const dest: Destination = {
		"name": "test",
		"latitude": 38.9486650738765,
		"longitude": -77.01459411621002,
		"notes": "hello world",
		"fromDate": "01-01-2020",
		"toDate": "01-05-2020",
		"images": [] as string[],
		"routeColor": "#888"
	};
	
    const wrapper = shallowMount(DestinationComponent, {
      propsData: {
		  destination: dest
	  }
    });
	
	// make sure destination name is there
    expect(wrapper.find("#test").text()).toEqual(dest.name);
	
	// make sure destination notes are there
	const notes: HTMLInputElement = wrapper.find("#test_notes").element as HTMLInputElement;
	expect(notes.value).toEqual(dest.notes);
	
	const locationText = wrapper.find(".latlng").text();
	expect(locationText).toEqual(`lat: ${dest.latitude}, long: ${dest.longitude}`);
  });
  
})
