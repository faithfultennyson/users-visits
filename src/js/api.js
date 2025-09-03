export async function getIntegrations() {
  try {
    const r = await fetch('/config/integrations.json', { cache: 'no-store' });
    if (!r.ok) throw new Error('integrations fetch failed');
    const j = await r.json();
    const instagram = !!(j.instagram && j.instagram.client_id && j.instagram.access_token);
    const tiktok    = !!(j.tiktok && j.tiktok.client_key && j.tiktok.access_token);
    return { instagram, tiktok, raw: j };
  } catch {
    return { instagram: false, tiktok: false, raw: null };
  }
}




// Mock CDN images
const mockImages = [
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1506086679524-493c64fdfaa6?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=742&h=960&fit=crop",
    "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=742&h=960&fit=crop",
    "https://images.pexels.com/photos/247322/pexels-photo-247322.jpeg?w=742&h=960&fit=crop",
    "https://images.pexels.com/photos/34950/pexels-photo.jpg?w=742&h=960&fit=crop",
    "https://images.pexels.com/photos/210186/pexels-photo-210186.jpeg?w=742&h=960&fit=crop",
    "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?w=742&h=960&fit=crop",
    "https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?w=742&h=960&fit=crop",
    "https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?w=742&h=960&fit=crop",
    "https://images.pexels.com/photos/3225519/pexels-photo-3225519.jpeg?w=742&h=960&fit=crop",
    "https://images.pexels.com/photos/3225520/pexels-photo-3225520.jpeg?w=742&h=960&fit=crop",
    "https://images.pexels.com/photos/3225521/pexels-photo-3225521.jpeg?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1506086679524-493c64fdfaa6?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=742&h=960&fit=crop",
    "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=742&h=960&fit=crop",
    "https://images.pexels.com/photos/247322/pexels-photo-247322.jpeg?w=742&h=960&fit=crop",
    "https://images.pexels.com/photos/34950/pexels-photo.jpg?w=742&h=960&fit=crop",
    "https://images.pexels.com/photos/210186/pexels-photo-210186.jpeg?w=742&h=960&fit=crop",
    "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?w=742&h=960&fit=crop",
    "https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?w=742&h=960&fit=crop",
    "https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?w=742&h=960&fit=crop",
    "https://images.pexels.com/photos/3225519/pexels-photo-3225519.jpeg?w=742&h=960&fit=crop",
    "https://images.pexels.com/photos/3225520/pexels-photo-3225520.jpeg?w=742&h=960&fit=crop",
    "https://images.pexels.com/photos/3225521/pexels-photo-3225521.jpeg?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1506086679524-493c64fdfaa6?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1520975918318-3e3c7c4b3f4b?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1506086679524-493c64fdfaa6?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=742&h=960&fit=crop",
    "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=742&h=960&fit=crop",
    "https://images.pexels.com/photos/247322/pexels-photo-247322.jpeg?w=742&h=960&fit=crop",
    "https://images.pexels.com/photos/34950/pexels-photo.jpg?w=742&h=960&fit=crop",
    "https://images.pexels.com/photos/210186/pexels-photo-210186.jpeg?w=742&h=960&fit=crop",
    "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?w=742&h=960&fit=crop",
    "https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?w=742&h=960&fit=crop",
    "https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?w=742&h=960&fit=crop",
    "https://images.pexels.com/photos/3225519/pexels-photo-3225519.jpeg?w=742&h=960&fit=crop",
    "https://images.pexels.com/photos/3225520/pexels-photo-3225520.jpeg?w=742&h=960&fit=crop",
    "https://images.pexels.com/photos/3225521/pexels-photo-3225521.jpeg?w=742&h=960&fit=crop",

    // ... more images
];


const mocktitles = [
  "Glow Up Your Day",
  "Coffee & Confidence",
  "Dream Big, Shine On",
  "Life in Full Color",
  "Rise and Hustle",
  "Vibes Over Views",
  "Chill Mode On",
  "Create Your Magic",
  "Stay Wild, Moon Child",
  "Good Energy Only",
  "Make It Happen",
  "Sunsets & Stories",
  "Hustle and Heart",
  "Own Your Power",
  "Keep It Real",
  "Spark Your Soul",
  "Bold & Brilliant",
  "Just Keep Going",
  "Mindset Matters",
  "Radiate Positivity",
  "Level Up Today",
  "Do It With Love",
  "Chase the Light",
  "Fresh Start Feels",
  "Inspire & Impact",
  "Be Your Vibe",
  "Always Keep Shining",
  "Life is Hard",
  "Turn Your Struggles Into Strength",
  "Keep Going Even When It’s Tough",
  "Dreams Don’t Work Without Effort",
  "Rise Stronger Every Single Time",
  "Your Future Self Will Thank You",
  "Hustle Until Your Haters Ask How",
  "Believe in the Power of You",
  "Small Steps Lead to Big Wins",
  "Make Today Count, No Excuses",
  "Create a Life You Truly Love",
  "Happiness Is a Daily Choice",
  "Live Simply, Love Deeply",
  "Find Joy in the Little Things",
  "Balance Is the new Success",
  "Your Peace Is Your Power",
  "Slow Down and Savor the Moment",
  "Life Feels Better With Gratitude",
  "Choose Calm Over Chaos Always",
  "Make Space for What Matters",
  "🌍 Collect Memories, Not Just Things",
  "Let the World Be Your Playground",
  "Adventure Awaits, Go Find It",
  "Travel Far, Learn More, Live Full",
  "Escape the Ordinary, See the World",
  "Wander Often, Wonder Always",
  "The Journey Is the Real Destination",
  "Take the Trip, Make the Story",
  "Explore More, Worry Less",
  "Find Yourself in New Places",
  "Taste the Joy in Every Bite",
  "Cooking Is Love Made Visible",
  "Eat Well, Live Well, Be Well",
  "Life Is Short, Eat Dessert First",
  "Savor the Flavor of Every Moment",
  "Happiness Is Homemade Cooking",
  "Food Is the Ingredient to Joy",
  "Spice Up Your Life With Flavor",
  "Share Meals, Share Memories",
  "👗 Style Is a Way to Say Who You Are",
  "Dress Like You Already Made It",
  "Confidence Is the Best Outfit",
  "Fashion Fades, Style Is Forever",
  "Wear What Makes You Feel Alive",
  "Your Style, Your Signature",
  "Life’s Too Short for Boring Clothes",
  "Be Bold, Be Bright, Be You",
  "Slay the Day With Your Outfit",
  "Elegance Is Effortless Grace",
  "Turn Pain Into Your Greatest Power",
  "Live Boldly, Love Fiercely Always",
  "Your Energy Attracts Your Tribe",
  "Keep Shining Even in the Storm",
  "Make Your Own Sunshine Daily",
  "The Best View Comes After the Climb",
  "Don’t Just Exist, Start to Live",
  "Be the Reason Someone Smiles Today",
  "Life Begins at the End of Comfort",
  "Your Vibe Creates Your Reality",
  "Wild & Free",
  "Create & Conquer",
  "Joy in the Journey",
  "Shine Without Fear",
  "Small Wins Count",
  "Love the Process",
  "Fearless & Focused",
  "Make Waves",
  "Your Story Matters",
  "Keep Moving Forward",
  "Rise Above It",
  "Find Your Spark",
  "Live More Today",
  "Stay Golden",
  "Choose Happiness",
  "Own the Moment",
  "Big Dreams Ahead",
  "You Got This",
  "Be the Energy",
  "Limitless Living",
  "Trust the Process",
  "Glow From Within",
  "Win the Day",
  "Always Keep Shining"
];




// Generate random mock cards
function generateMockCards(count = 200000) {
    return Array.from({ length: count }, (_, i) => ({
        uid: `card-${i}`,
        imageUrl: mockImages[i % mockImages.length],
        title: mocktitles[i % mocktitles.length],
        targetUrl: 'https://example.com',
        source: i % 2 === 0 ? 'ig' : 'tt',
        index: i // Add index property, 
    }));
}

// Mock API calls
export async function getPublicProfile() {
    console.log('Fetching public profile...');
    const res = await fetch('/config/profile.json');
    if (!res.ok) throw new Error('Failed to load profile');
    return res.json();
}

export async function getLinksConfig() {
    console.log('Fetching links config...');
    const res = await fetch('/config/links.json');
    if (!res.ok) throw new Error('Failed to load links');
    const data = await res.json();
    const isValid = href => typeof href === 'string' && href.length <= 2048 && (
        href.startsWith('https://') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('/')

    );
    const filter = arr => Array.isArray(arr) ? arr.filter(l => isValid(l.href)) : [];
    if (data.header) {
        data.header.quick = filter(data.header.quick).slice(0, 3);
        data.header.overflow = filter(data.header.overflow);
    }
    if (data.footer) {
        data.footer.icons = filter(data.footer.icons);
        if (Array.isArray(data.footer.text_links)) {
            data.footer.text_links = data.footer.text_links.filter(l => isValid(l.href));
        }
    }
    return data;
}

export async function getPublicCards() {
    console.log('Fetching cards...');
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    const cards = generateMockCards();
    console.log(`Generated ${cards.length} mock cards`);
    return cards;
}
