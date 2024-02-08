const stickers = [
	'/default-covers/collections/stickers/japanese.png',
	'/default-covers/collections/stickers/veggies.png',
	'/default-covers/collections/stickers/breakfast.png',
	'/default-covers/collections/stickers/japanese2.png',
	'/default-covers/collections/stickers/bbq.png',
	'/default-covers/collections/stickers/indian.png'
];

const cartoon = [
	'/default-covers/collections/cartoon/japanese.png',
	'/default-covers/collections/cartoon/breakfast.png',
	'/default-covers/collections/cartoon/bbq.png',
	'/default-covers/collections/cartoon/overview.png',
	'/default-covers/collections/cartoon/indian.png'
];

const realistic = [
	'/default-covers/collections/realistic/japanese.png',
	'/default-covers/collections/realistic/breakfast.png',
	'/default-covers/collections/realistic/bbq.png',
	'/default-covers/collections/realistic/overview.png',
	'/default-covers/collections/realistic/indian.png'
];

const defaultCovers = [...stickers, ...cartoon, ...realistic];
const defaultCollectionCovers: { [key: string]: string[] } = {
	realistic: realistic,
	stickers: stickers,
	cartoon: cartoon
};

export { defaultCovers, defaultCollectionCovers };
