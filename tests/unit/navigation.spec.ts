import { shallowMount, Wrapper } from '@vue/test-utils'
import Navigation from '@/components/Navigation.vue'

// TODO: not test implementation details
describe('Navigation.vue', () => {
    it('make sure trip dropdown is populated', () => {
        const tripNames = ["test1", "trip2"];
	
        const wrapper = shallowMount(Navigation, {
            props: {
                listOfTripNames: tripNames
            }
        });
	
        // make sure we get 2 anchor elements (one for each trip name)
        const anchorElements = wrapper.findAll("a").filter(x => x.text() === "test1" || x.text() === "trip2");
        expect(anchorElements.length).toBe(2);
        
        for(let i = 0; i < anchorElements.length; i++){
            expect((anchorElements[i] as Wrapper<Vue>).text()).toEqual(tripNames[i]);
        }
    });
  
})
