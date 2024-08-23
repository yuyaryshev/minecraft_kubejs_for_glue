// priority: 0
// /kubejs reload startup_scripts

// console.info('Hello, World! (You will only see this line once in console, during startup)')
// kubejs/assets/kubejs/textures/item/test_item.png

// onEvent('item.registry', event => {
// 	// Register new items here
// 	// event.create('example_item').displayName('Example Item')
// })
//
// onEvent('block.registry', event => {
// 	// Register new blocks here
// 	// event.create('example_block').material('wood').hardness(1.0).displayName('Example Block')
// })

onEvent("item.modification", (event) => {
    const stackSizes = {
        "minecraft:raw_iron": 2,
        "minecraft:raw_gold": 2,
        "create:raw_zinc": 2,
        "minecraft:raw_copper": 2,
        // 'occultism:raw_silver':2, // Нужно посмотреть в игре верный id выпадающего предмета из этой руды
        "tconstruct:raw_cobalt": 2,
        // mekanism:osmium_ore
        // mekanism:tin_ore
        // mekanism:lead_ore
    };

    for (const k in stackSizes) {
        event.modify(k, (item) => {
            item.maxStackSize = stackSizes[k];
        });
    }

    event.modify("minecraft:iron_sword", (item) => {
        item.maxDamage = 333; // Изменение максимальной прочности предмета.
        item.attackDamage = 444;
        item.setAttackDamage(555);
        const t = (tierOptions) => {
            // int uses
            // float speed
            tierOptions.attackDamageBonus = 777;
            // int level
            // int enchantmentValue
			tierOptions.repairIngredient = 'minecraft:copper_ingot';
            // Ingredient repairIngredient
        };
		t.attackDamageBonus = 77;
		t.repairIngredient = 'minecraft:copper_nugget';

        item.tier = t;
        item.tierOptions = t;
    });
});

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
