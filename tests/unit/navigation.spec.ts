import { shallowMount, Wrapper } from '@vue/test-utils'
import Navigation from '@/components/Navigation.vue'

// TODO: not test implementation details
describe('Navigation.vue', () => {
	it('make sure trip dropdown is populated', () => {
		const tripNames = ["test1", "trip2"];
	
		const wrapper = shallowMount(Navigation, {
			propsData: {
				listOfTripNames: tripNames
			}
		});
	
		// make sure we get 2 anchor elements (one for each trip name)
		const anchorElements = wrapper.findAll("a");
		expect(anchorElements.length).toBe(2);
	
		const anchorElArray = anchorElements.wrappers;
		for(let i = 0; i < anchorElArray.length; i++){
			expect((anchorElArray[i] as Wrapper<Vue>).text()).toEqual(tripNames[i]);
		}
	});
  
})
