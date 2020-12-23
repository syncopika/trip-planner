import { shallowMount } from '@vue/test-utils'
import Calendar from '@/components/Calendar.vue'

describe('Calendar.vue', () => {
  it('renders Calendar properly', () => {
	const date = "12-23-2020";
	const destName = "test";
	const isEditing = true;
	
	const wrapper = shallowMount(Calendar, {
		propsData: {
			destName,
			isEditing,
			date
		}
	});
	
	// make sure day, month, year inputs exist IFF isEditing
	expect(wrapper.findAll("input").length).toBe(3);
	expect(wrapper.find(`#${destName}day`).exists()).toBe(true);
    expect(wrapper.find(`#${destName}month`).exists()).toBe(true);
	expect(wrapper.find(`#${destName}year`).exists()).toBe(true);
	
  });
})