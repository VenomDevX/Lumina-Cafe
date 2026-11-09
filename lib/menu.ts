export type Category = "coffee" | "cold-brew" | "tea" | "smoothies" | "pastries"

export type MenuItem = {
  name: string
  description: string
  price: number
  category: Category
  tags?: ("signature" | "vegan" | "iced" | "new")[]
  image?: string
}

export const categories: { id: Category; label: string }[] = [
  { id: "coffee", label: "Coffee" },
  { id: "cold-brew", label: "Cold Brew" },
  { id: "tea", label: "Tea & Matcha" },
  { id: "smoothies", label: "Smoothies" },
  { id: "pastries", label: "Pastries" },
]

export const menu: MenuItem[] = [
  // Coffee
  { name: "Tide Latte", description: "Double ristretto, wildflower honey, sea-salt milk foam.", price: 6.5, category: "coffee", tags: ["signature"], image: "/images/tide-latte.jpg" },
  { name: "Shoreline Cortado", description: "Equal parts espresso and silky steamed milk, served in glass.", price: 4.75, category: "coffee", tags: ["signature"], image: "/images/cortado.jpg" },
  { name: "Driftwood Espresso", description: "Our house blend: cocoa, toasted almond, a little citrus.", price: 3.5, category: "coffee", image: "/images/menu/espresso.jpg" },
  { name: "Golden Hour Flat White", description: "Velvet microfoam over a turmeric-kissed double shot.", price: 5.5, category: "coffee", tags: ["new"], image: "/images/menu/flat-white.jpg" },
  { name: "Slow Pour-Over", description: "Single origin, brewed by hand. Ask for today's bean.", price: 6, category: "coffee", image: "/images/pour-over.jpg" },
  { name: "Oat Cappuccino", description: "Classic cappuccino with creamy oat milk.", price: 5, category: "coffee", tags: ["vegan"], image: "/images/menu/cappuccino.jpg" },

  // Cold brew
  { name: "Salted Caramel Cold Brew", description: "18-hour steep, house caramel, a pinch of fleur de sel.", price: 6, category: "cold-brew", tags: ["signature", "iced"], image: "/images/caramel-cold-brew.jpg" },
  { name: "Coconut Iced Latte", description: "Cold brew, coconut milk, toasted coconut sugar.", price: 6.25, category: "cold-brew", tags: ["signature", "iced", "vegan"], image: "/images/coconut-iced-latte.jpg" },
  { name: "Nitro Low Tide", description: "Nitrogen-charged cold brew, naturally sweet and creamy.", price: 5.75, category: "cold-brew", tags: ["iced"], image: "/images/menu/nitro.jpg" },
  { name: "Espresso Tonic", description: "Bright tonic, orange peel, a floating shot.", price: 5.5, category: "cold-brew", tags: ["iced", "vegan"], image: "/images/menu/espresso-tonic.jpg" },

  // Tea
  { name: "Sunset Iced Tea", description: "Black tea, peach nectar, lime wheels, mint.", price: 5.25, category: "tea", tags: ["signature", "iced", "vegan"], image: "/images/sunset-iced-tea.jpg" },
  { name: "Ceremonial Matcha", description: "Stone-ground Uji matcha, whisked to order.", price: 5.5, category: "tea", tags: ["vegan"], image: "/images/menu/matcha.jpg" },
  { name: "Sea Breeze Chai", description: "Slow-simmered spices, steamed milk, cardamom dust.", price: 5, category: "tea", image: "/images/menu/chai.jpg" },
  { name: "Chamomile Cloud", description: "Chamomile, vanilla bean, honey, oat foam.", price: 4.5, category: "tea", tags: ["vegan"], image: "/images/menu/chamomile.jpg" },

  // Smoothies
  { name: "Cocoa Driftwood Frappé", description: "Espresso, dark cocoa, whipped cream, cookie crumb.", price: 6.75, category: "smoothies", tags: ["signature", "iced"], image: "/images/cocoa-frappe.jpg" },
  { name: "Mango Lagoon", description: "Alphonso mango, coconut yogurt, lime zest.", price: 6.5, category: "smoothies", tags: ["vegan"], image: "/images/menu/mango.jpg" },
  { name: "Berry Reef", description: "Blueberry, strawberry, banana, chia.", price: 6.5, category: "smoothies", tags: ["vegan"], image: "/images/menu/berry.jpg" },
  { name: "Green Tide", description: "Spinach, pineapple, ginger, cucumber.", price: 6.25, category: "smoothies", tags: ["vegan", "new"], image: "/images/menu/green.jpg" },

  // Pastries
  { name: "Butter Croissant", description: "Laminated over three days. Shatters on the first bite.", price: 3.75, category: "pastries", image: "/images/croissant.jpg" },
  { name: "Sea Salt Cookie", description: "Brown butter, dark chocolate, Maldon flakes.", price: 3, category: "pastries", image: "/images/menu/cookie.jpg" },
  { name: "Banana Bread", description: "Toasted, with whipped honey butter.", price: 4.25, category: "pastries", image: "/images/menu/bread.jpg" },
  { name: "Cardamom Bun", description: "Swedish-style knot, pearl sugar.", price: 4, category: "pastries", tags: ["new"] },
]

export const signature = menu.filter((item) => item.tags?.includes("signature"))

export const formatPrice = (price: number) => `$${price.toFixed(2)}`
