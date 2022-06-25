// priority: 0
// /kubejs reload startup_scripts

console.info('Hello, World! (You will only see this line once in console, during startup)')
// kubejs/assets/kubejs/textures/item/test_item.png
	
onEvent('item.registry', event => {
	// Register new items here
	// event.create('example_item').displayName('Example Item')
})

onEvent('block.registry', event => {
	// Register new blocks here
	// event.create('example_block').material('wood').hardness(1.0).displayName('Example Block')
})

onEvent('item.modification', event => {
	
	const stackSizes = {
		'minecraft:raw_iron':1,
		'minecraft:raw_gold':1,
		'minecraft:raw_zinc':1,
		'minecraft:raw_copper':1		
		// mekanism:osmium_ore
		// mekanism:tin_ore
		// mekanism:lead_ore
		// occultism:silver_ore
	};
	
	for(const k in stackSizes) {
	  event.modify(k, item => {
		item.maxStackSize = stackSizes[k];
	  });
	}
})

// onEvent('worldgen.add', event => {
//   event.addOre(ore => {
//     ore.block = 'minecraft:glowstone' // Block ID (Use [] syntax for properties)
//     ore.spawnsIn.blacklist = false // Inverts spawn whitelist
//     ore.spawnsIn.values = [ // List of valid block IDs or tags that the ore can spawn in
//       '#minecraft:base_stone_overworld' // Default behavior - ores spawn in all stone types
//     ]
//
//     ore.biomes.blacklist = true // Inverts biome whitelist
//     ore.biomes.values = []
//
//     ore.clusterMinSize = 5 // Min blocks per cluster (currently ignored, will be implemented later, it's always 1)
//     ore.clusterMaxSize = 9 // Max blocks per cluster
//     ore.clusterCount = 30 // Clusters per chunk
//     ore.minHeight = 0 // Min Y ore spawns in
//     ore.maxHeight = 64 // Max Y ore spawns in
//     ore.squared = true // Adds random value to X and Z between 0 and 16. Recommended to be true
//     // ore.chance = 4 // Spawns the ore every ~4 chunks. You usually combine this with clusterCount = 1 for rare ores
//   })
// })