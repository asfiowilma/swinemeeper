type ShopData = {
	group: string;
	items: ShopItem[];
};

type ShopItem = {
	id: string;
	group: string;
	name: string;
	price: number;
};

type ShopState = Record<string, boolean>;
