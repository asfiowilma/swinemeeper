export const SHOP_ITEMS = [
	{
		id: 'beginner',
		group: 'Difficulty',
		name: 'Beginner',
		price: 0
	},
	{
		id: 'intermediate',
		group: 'Difficulty',
		name: 'Intermediate',
		price: 30
	},
	{
		id: 'expert',
		group: 'Difficulty',
		name: 'Expert',
		price: 100
	},
	{
		id: 'flag-basic',
		group: 'Flags',
		name: '🚩 :red-flag:',
		price: 0
	},
	{
		id: 'flag-skull',
		group: 'Flags',
		name: '💀 :skull:',
		price: 50
	},
	{
		id: 'flag-clown',
		group: 'Flags',
		name: '🤡 :clown:',
		price: 50
	},
	{
		id: 'flag-bomb',
		group: 'Flags',
		name: '💣 :bomb:',
		price: 50
	},
	{
		id: 'flag-white',
		group: 'Flags',
		name: '🏳️ :white-flag:',
		price: 50
	},
	{
		id: 'bomb-basic',
		group: 'Bombs',
		name: '💣 :bomb:',
		price: 0
	}
];

export const SHOP_DATA: ShopData[] = [...new Set(SHOP_ITEMS.map((item) => item.group))].map(
	(group) => ({
		group,
		items: SHOP_ITEMS.filter((item) => item.group === group)
	})
);
