import { shallowMount } from '@vue/test-utils'
import OptionsModal from '@/components/OptionsModal.vue'

describe('OptionsModal.vue', () => {
    it('renders options modal component', () => {
        const wrapper = shallowMount(OptionsModal, {
            props: {
                initialTheme: "pastel",
                initialShowLocationLookup: false,
                initialShowSuggestedDestinations: false,
                initialOverpassApiEntity: "restaurant",
                initialNextDestDataSource: "overpassApi",
            }
        });
        
        expect(wrapper.findAll("h1").length).toBe(1);
        expect(wrapper.find("h1").text()).toEqual("options");
	
        // make sure expected elements are disabled if applicable + have the right values based on props
        expect(wrapper.find("#themeSelect").exists()).toBe(true);
        expect(wrapper.findAll("button").length).toBe(2); // save and close buttons
        expect((wrapper.find("#toggleSuggestedDestinations").element as HTMLInputElement).checked).toEqual(false);
        expect((wrapper.find("#toggleLocationSearchBar").element as HTMLInputElement).checked).toEqual(false);
        expect((wrapper.find("#databaseOption").element as HTMLInputElement).disabled).toEqual(true);
        expect((wrapper.find("#overpassApiOption").element as HTMLInputElement).disabled).toEqual(true);
    });
  
})
