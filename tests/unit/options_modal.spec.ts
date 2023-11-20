import { shallowMount } from '@vue/test-utils'
import OptionsModal from '@/components/OptionsModal.vue'

describe('OptionsModal.vue', () => {
    it('renders options modal component', () => {
        const wrapper = shallowMount(OptionsModal, {
            propsData: {
                initialTheme: "pastel",
                initialShowLocationLookup: false,
                initialShowSuggestedDestinations: false,
                initialOverpassApiEntity: "restaurant",
                initialNextDestDataSource: "overpassApi",
            }
        });
        
        expect(wrapper.findAll("h1").length).toBe(1);
        expect(wrapper.find("h1").text()).toEqual("options");
	
        // TODO: make sure expected elements are disabled if applicable + have the right values based on props
    });
  
})
