export class ypdcard {
    constructor(
        public archetype: string,
        public atk: number,
        public def: number,
        public desc: string,
        public id: string,
        public level: number,
        public name: string,
        public race: string,
        public type: string,
        public attribute: string,
        public card_images: ypdimage[],
        public card_prices: ypdprices[],
        public card_sets: ypdset[],


    ) {
        this.archetype = archetype,
            this.atk = atk,
            this.def = def,
            this.desc = desc,
            this.id = id,
            this.level = level,
            this.name = name,
            this.race = race,
            this.type = type,
            this.attribute = attribute,
            this.card_images = card_images,
            this.card_prices = card_prices,
            this.card_sets = card_sets
    }
}
export class ypdimage {
    constructor(
        public id: string,
        public image_url: string,
        public image_url_small: string,
        public image_url_cropped:string| undefined

    ) {
        this.id = id
        this.image_url = image_url
        this.image_url_small = image_url_small
        this.image_url_cropped = image_url_cropped
    }
}

export class ypdprices {
    constructor(
        public amazon_price: string = '',
        public cardmarket_price: string = '',
        public coolstuffinc_price: string = '',
        public ebay_price: string = '',
        public tcgplayer_price: string = '',
    ) {
        this.amazon_price = amazon_price
        this.cardmarket_price = cardmarket_price
        this.coolstuffinc_price = coolstuffinc_price
        this.ebay_price = ebay_price
        this.tcgplayer_price = tcgplayer_price

    }
}

export class ypdset {
    constructor(
        public id: string = '',
        public name: string = '',
        public set_code: string = '',
        public set_name: string = '',
        public set_price: string = '',
        public set_rarity: string = '',
        public set_rarity_code: string = '',
    ) {
        this.id = id
        this.name = name
        this.set_code = set_code
        this.set_name = set_name
        this.set_price = set_price
        this.set_rarity = set_rarity
        this.set_rarity_code = set_rarity_code

    }
}

export class ypdresponse {
    constructor(
        public data: ypdcard[],

    ) {
        this.data = data


    }
}