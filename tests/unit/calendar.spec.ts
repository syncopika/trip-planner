import { shallowMount, Wrapper } from '@vue/test-utils'
import Calendar from '@/components/Calendar.vue'

describe('Calendar.vue', () => {
  it('renders Calendar properly', () => {
	const date = "12-23-2020";
	const destName = "test";
	const isEditing = true;
	const header = "to:";
	
	const wrapper = shallowMount(Calendar, {
		propsData: {
			destName,
			isEditing,
			date,
			header,
		}
	});
	
	// make sure day, month, year inputs exist IFF isEditing
	expect(wrapper.findAll("input").length).toBe(3);
	expect(wrapper.find(`#${destName}day`).exists()).toBe(true);
    expect(wrapper.find(`#${destName}month`).exists()).toBe(true);
	expect(wrapper.find(`#${destName}year`).exists()).toBe(true);
	
	// make sure input text is empty
	// TODO: this is correct because the input boxes shouldn't be populated with values until
	// the updated lifecycle hook function is called. probably should separate the function and put in methods instead.
	wrapper.findAll("input").wrappers.forEach((inputWrapper) => {
		const inputEl: HTMLInputElement = (inputWrapper as Wrapper<Vue>).element as HTMLInputElement;
		expect(inputEl.value).toBe("");
	});
	
  });
})