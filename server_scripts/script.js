// priority: 100

const useTinkerMoltenOnlyFromSteelUp = true;
const lockTinkerBricksWithBlazeMixing = false;

const withMekanism = true;

settings.logAddedRecipes = true;
settings.logRemovedRecipes = true;
settings.logSkippedRecipes = false;
settings.logErroringRecipes = true;

// console.info('Yya Hello, World!')

// Find and replace bedrock with something usefull

let gearToReplace = [
    /[_]pickaxe/,
    /[_]axe/,
    /[_]shovel/,
    /[_]hoe/,
    /sword/,
    /leggings/,
    /chestplate/,
    /[_]boots/,
    /[_]helmet/,
    /[_]helm/,
    /[_]armet/,
    /[_]stylet/,
    /[_]blacksmith_gavel/,
];

let materialsToReplace = {
    diamond: "create_modpack_glue:diamond_weapon_ingot",
    iron_ingot: "create_modpack_glue:iron_weapon_ingot",
    iron_nugget: "minecraft:iron_ingot",
    //    "magistuarmory:steel_ingot": "create_modpack_glue:steel_weapon_ingot",
    //    "magistuarmory:steel_nugget": "minecraft:iron_ingot",
    "create:brass_ingot": "create:brass_block",
};

let crushingRecipes = {
    "minecraft:quartz": "mekanism:dust_quartz",
    "minecraft:diamond": "mekanism:dust_diamond",
    "minecraft:emerald": "mekanism:dust_emerald",
    "minecraft:gold_ingot": "mekanism:dust_gold",
    "minecraft:iron_ingot": "mekanism:dust_iron",
    "minecraft:copper_ingot": "mekanism:dust_copper",
    "minecraft:netherite_ingot": "mekanism:dust_netherite",
    "minecraft:lapis_lazuli": "mekanism:dust_lapis_lazuli",
    "minecraft:coal": "mekanism:dust_coal",
    "minecraft:charcoal": "mekanism:dust_charcoal",
    "minecraft:obsidian": "mekanism:dust_obsidian",
    "mekanism:ingot_steel": "mekanism:dust_steel",
    "mekanism:ingot_bronze": "mekanism:dust_bronze",
    "mekanism:ingot_osmium": "mekanism:dust_osmium",
    "mekanism:ingot_tin": "mekanism:dust_tin",
    "mekanism:ingot_lead": "mekanism:dust_lead",
    //'mekanism:ingot_uranium':'mekanism:dust_uranium',
};

onEvent("recipes", (event) => {
    event.remove({ id: "magistuarmory:steel_nuggets_to_steel_ingot" });
    event.remove({ id: "magistuarmory:furnace/steel_ingot_blasting" });
    event.remove({ id: "magistuarmory:steel_ingot_blasting" });
    event.remove({ id: "mekanism:processing/steel/ingot/from_dust_blasting" });
    // event.remove({id: 'magistuarmory:steel_ingot'})
    // {input: '#forge:dusts/redstone',output: '#minecraft:wool'}

    // Later metherite tools & weapons
    event.remove({ id: "minecraft:netherite_ingot" });

    // Harder weapons and tools: iron and above - part 1
    for (let gearRegexp of gearToReplace) {
        event.remove({ mod: "ae2", id: gearRegexp });
    }

    for (let material in materialsToReplace) {
        let targetMaterial = materialsToReplace[material];

        event.replaceInput({ mod: "magistuarmory" }, material, targetMaterial);

        for (let gearRegexp of gearToReplace) {
            event.replaceInput({ id: gearRegexp }, material, targetMaterial);
        }
    }

    // Harder weapons and tools: iron and above - part 2
    // Now create some new recipes to produce all thouse items

    // Early access to googgles and wrench: change gold to copper
    // because you don't have an iron axe to mine gold
    event.replaceInput({ id: /goggles/ }, "create:golden_sheet", "create:copper_sheet");

    event.replaceInput({ id: /wrench/ }, "create:golden_sheet", "create:copper_sheet");

    // For iron tools & weapons
    event.recipes.create.pressing({
        ingredients: [{ item: "minecraft:iron_block" }],
        results: [{ item: "create_modpack_glue:iron_weapon_ingot", count: 1 }],
        processingTime: 300,
    });

    // For steel tools & weapons
    event.recipes.create.mixing({
        ingredients: [{ item: "mekanism:dust_quartz" }, { item: "mekanism:dust_charcoal" }],
        results: [{ item: "create_modpack_glue:cleaning_composite", count: 1 }],
        processingTime: 200,
    });

    if (!useTinkerMoltenOnlyFromSteelUp) {
        // For diamond tools & weapons
        event.recipes.create.mixing({
            ingredients: [{ item: "mekanism:dust_iron" }, { item: "mekanism:dust_diamond" }, { item: "mekanism:dust_gold" }],
            results: [{ item: "create_modpack_glue:diamond_weapon_composite", count: 1 }],
            processingTime: 100,
            heatRequirement: "heated",
            // "heatRequirement": "heated", "superheated"
        });

        event.recipes.create.pressing({
            ingredients: [{ item: "create_modpack_glue:diamond_weapon_composite", count: 9 }],
            results: [{ item: "create_modpack_glue:diamond_weapon_ingot", count: 1 }],
            processingTime: 300,
        });

        event.recipes.create.mixing({
            ingredients: [{ item: "create_modpack_glue:cleaning_composite" }, { item: "mekanism:dust_diamond" }, { item: "minecraft:redstone" }],
            results: [{ item: "create_modpack_glue:adv_cleaning_component", count: 1 }],
            processingTime: 100,
        });

        event.recipes.create.pressing({
            ingredients: [{ item: "create_modpack_glue:adv_cleaning_component", count: 9 }],
            results: [{ item: "create_modpack_glue:adv_cleaning_composite", count: 1 }],
            processingTime: 300,
        });

        event.recipes.create.mixing({
            ingredients: [{ item: "create_modpack_glue:adv_cleaning_composite" }, { item: "minecraft:netherite_scrap" }],
            results: [{ item: "create_modpack_glue:inpure_netherite_dust", count: 1 }],
            processingTime: 100,
            heatRequirement: "heated",
        });

        event.blasting("minecraft:netherite_ingot", "create_modpack_glue:inpure_netherite_dust");
    }

    {
        // Ticker Construct balansing
        event.remove({ id: "tconstruct:smeltery/scorched/nether_grout" });
        event.remove({ id: "tconstruct:tables/crafting_station_from_logs" });
        if (lockTinkerBricksWithBlazeMixing) {
            event.remove({ id: "tconstruct:smeltery/seared/grout" });
            event.remove({ id: "tconstruct:smeltery/seared/grout_multiple" });
        }

        // Delay crafting_stations till netherite
        event.replaceInput({ mod: "tconstruct", id: /crafting_station/ }, "tconstruct:pattern", "minecraft:netherite_block");

        // tconstruct:grout
        event.recipes.create.mixing({
            ingredients: [{ item: "minecraft:clay_ball" }, { item: "minecraft:sand" }, { item: "minecraft:gravel" }],
            results: [{ item: "tconstruct:grout", count: 3 }],
            processingTime: lockTinkerBricksWithBlazeMixing ? 400 : 100,
            heatRequirement: lockTinkerBricksWithBlazeMixing ? "heated" : undefined,
        });

        // tconstruct:nether_grout - from soul_sand
        event.recipes.create.mixing({
            ingredients: [{ item: "minecraft:magma_cream" }, { item: "minecraft:soul_sand" }, { item: "minecraft:gravel" }],
            results: [{ item: "tconstruct:nether_grout", count: 3 }],
            processingTime: lockTinkerBricksWithBlazeMixing ? 400 : 100,
            heatRequirement: lockTinkerBricksWithBlazeMixing ? "heated" : undefined,
        });

        // tconstruct:nether_grout - from soul_soil
        event.recipes.create.mixing({
            ingredients: [{ item: "minecraft:magma_cream" }, { item: "minecraft:soul_soil" }, { item: "minecraft:gravel" }],
            results: [{ item: "tconstruct:nether_grout", count: 3 }],
            processingTime: lockTinkerBricksWithBlazeMixing ? 400 : 100,
            heatRequirement: lockTinkerBricksWithBlazeMixing ? "heated" : undefined,
        });
    }

    //
    // Add Create mod's variant of crushing things
    for (let material in crushingRecipes) {
        if (!withMekanism || (!material.includes("mekanism") && !crushingRecipes[material].includes("mekanism"))) {
            event.recipes.create.crushing({
                ingredients: [{ item: material }],
                results: [{ item: crushingRecipes[material], count: 1 }],
                processingTime: 100,
            });
        }
    }

    // No crafting table from the beginning
    event.remove({ id: "minecraft:crafting_table" });
    // event.remove({ id: /tconstruct:crafting_station/ });
    event.shaped("minecraft:crafting_table", ["PPP", "PSP", "PPP"], {
        S: "minecraft:netherite_block",
        P: "#minecraft:planks",
    });

    event.replaceInput({ input: "minecraft:crafting_table" }, "minecraft:crafting_table", "#minecraft:planks");
    event.replaceInput({ id: /tconstruct:crafting_station/ }, "tconstruct:pattern", "minecraft:netherite_block");

    // enchanting_table - move to late game
    event.replaceInput({ id: "minecraft:enchanting_table" }, "minecraft:diamond", "minecraft:netherite_block");

    // Later ender eye
    event.remove({ id: "minecraft:ender_eye" });
    event.shaped("minecraft:ender_eye", ["PB", "BN"], {
        P: "minecraft:ender_pearl",
        B: "tconstruct:necrotic_bone",
        N: "minecraft:netherite_block",
    });

    // Later ring of repair
    event.replaceInput({ id: "ring_of_repair:ring_of_repair" }, "minecraft:iron_ingot", "minecraft:netherite_block");

    // No fan in mob grinding
    event.replaceInput({ id: "mob_grinding_utils:recipe_fan" }, "minecraft:redstone_block", "minecraft:netherite_block");

    // Later ring of repair
    event.replaceInput({ id: "mob_grinding_utils:recipe_saw" }, "minecraft:iron_block", "minecraft:netherite_block");

    // Later enchanting and harder infuser
    event.replaceInput({ id: "enchantinginfuser:enchanting_infuser" }, "minecraft:crying_obsidian", "minecraft:netherite_block");

    event.replaceInput({ id: "enchantinginfuser:enchanting_infuser" }, "minecraft:ametyst_shard", "minecraft:wither_skeleton_skull");

    // Cogwheel packs for trading
    event.shaped("create_modpack_glue:small_cogwheel_pack", ["SB", "BS"], {
        S: "create:cogwheel",
        B: "create:large_cogwheel",
    });

    event.shaped("create_modpack_glue:big_cogwheel_pack", ["SS", "SS"], {
        S: "create_modpack_glue:small_cogwheel_pack",
    });

    // Food packs for trading
    event.shaped("create_modpack_glue:small_food_pack", ["SB", "BS"], {
        S: "minecraft:cooked_beef",
        B: "minecraft:egg",
    });

    // Food pack for trading
    event.shaped("create_modpack_glue:big_food_pack", ["SS", "SS"], {
        S: "create_modpack_glue:small_food_pack",
    });

    // Wooden tools
    event.shaped("minecraft:wooden_axe", ["PP", "SP"], {
        P: "#minecraft:planks",
        S: "minecraft:stick",
    });

    event.shaped("minecraft:wooden_pickaxe", ["SS", "S "], {
        S: "minecraft:stick",
    });

    event.shaped("minecraft:wooden_shovel", ["P", "S"], {
        P: "#minecraft:planks",
        S: "minecraft:stick",
    });

    event.shaped("minecraft:wooden_hoe", ["PP", " S"], {
        P: "#minecraft:planks",
        S: "minecraft:stick",
    });

    event.shaped("minecraft:wooden_sword", [" P", "S "], {
        P: "#minecraft:planks",
        S: "minecraft:stick",
    });

    event.shaped("minecraft:ladder", ["S ", "PP"], {
        P: "#minecraft:planks",
        S: "minecraft:stick",
    });

    event.shaped("comforts:sleeping_bag_white", ["W  ", " W ", "  W"], {
        W: "minecraft:white_wool",
    });

    // Cheap early anvil
    event.shaped("minecraft:chipped_anvil", ["BIB", " B ", "CCC"], {
        B: "minecraft:copper_block",
        C: "minecraft:copper_ingot",
        I: "minecraft:iron_ingot",
    });

    // REJECTED! Too cheap if full-plate is costy! Cheaper chainmail because cheaper chain
    // event.replaceInput({ id: "minecraft:chain" }, 'minecraft:iron_ingot', 'minecraft:iron_nugget');

    function multiShaped(result, shape, ingredients) {
        for (let ingredient of ingredients) {
            event.shaped(result, shape, ingredient);
        }
    }

    // Cheaper wood automation
    event.replaceInput({ id: "create:brass_hand" }, "create:brass_sheet", "create:copper_sheet");
    event.replaceInput({ id: "create:brass_hand" }, "create:electron_tube", "create:cogwheel");
	
    // Cheaper drawers
    event.replaceInput({ id: "storagedrawers:obsidian_storage_upgrade" }, "minecraft:obsidian", "minecraft:copper_ingot");
    event.replaceInput({ id: "storagedrawers:iron_storage_upgrade" }, "minecraft:iron_ingot", "create:andesite_alloy");
    event.replaceInput({ id: "storagedrawers:gold_storage_upgrade" }, "minecraft:gold_ingot", "minecraft:iron_ingot");
    event.replaceInput({ id: "storagedrawers:diamond_storage_upgrade" }, "minecraft:diamond", "minecraft:gold_ingot");
    event.replaceInput({ id: "storagedrawers:emerald_storage_upgrade" }, "minecraft:emerald", "create:brass_ingot");
    event.replaceInput({ mod: "storagedrawers", id: /controller/ }, "minecraft:comparator", "minecraft:copper_ingot");
    event.replaceInput({ mod: "storagedrawers", id: /controller/ }, "minecraft:diamond", "minecraft:copper_ingot");
    event.replaceInput({ mod: "storagedrawers", id: /controller/ }, "minecraft:diamond", "minecraft:copper_ingot");
    event.replaceInput({ mod: "storagedrawers", id: /controller/ }, "minecraft:gold_ingot", "minecraft:copper_ingot");
    event.replaceInput({ mod: "storagedrawers", id: /compacting/ }, "minecraft:piston", "minecraft:cobblestone");
    event.replaceInput({ mod: "storagedrawers", id: /compacting/ }, "minecraft:stone", "minecraft:cobblestone");
    event.replaceInput({ mod: "storagedrawers", id: /compacting/ }, "minecraft:iron_ingot", "minecraft:cobblestone");
    event.replaceInput({ id: "storagedrawers:drawer_key" }, "minecraft:gold_ingot", "minecraft:copper_ingot");
    event.replaceInput({ id: "storagedrawers:drawer_key" }, "minecraft:gold_nugget", "create:copper_nugget");
    event.replaceInput({ id: "storagedrawers:quantify_key" }, "minecraft:writable_book", "minecraft:book");
    event.replaceInput({ id: "storagedrawers:concealment_key" }, "minecraft:ender_eye", "create:copper_nugget");
    event.replaceInput({ id: "reliquary:handgun" }, "minecraft:iron_ingot", "minecraft:netherite_block");
    /*
storagedrawers:obsidian_storage_upgrade - minecraft:obsidian -> minecraft:copper_ingot
storagedrawers:iron_storage_upgrade - minecraft:iron_ingot -> create:andesite_alloy
storagedrawers:gold_storage_upgrade - minecraft:gold_ingot -> minecraft:iron_ingot
storagedrawers:diamond_storage_upgrade - minecraft:diamond -> minecraft:gold_ingot
storagedrawers:diamond_storage_upgrade - minecraft:emerald -> create:brass_ingot
storagedrawers:creative_storage_upgrade - добавить рецепт sss dud sss 
s = minecraft:gold_ingot
u = storagedrawers:upgrade_template
d = minecraft:diamond
storagedrawers:controller 
minecraft:comparator -> create:copper_ingot
minecraft:diamond -> create:copper_ingot
storagedrawers:compacting_drawers
minecraft:piston -> iron_ingot
*/

        // T minecraft:red_dye | minecraft:redstone
        // L minecraft:green_dye | minecraft:lime_dye | minecraft:copper_nugget | tconstruct:greenheart_log | minecraft:emerald
        // M minecraft:smooth_stone
        // R tconstruct:cobalt_nugget | minecraft:lapis_lazuli | minecraft:blue_dye
        // B minecraft:gold_nugget | minecraft:yellow_dye
        // redstonepen:control_box

    event.shaped("redstonepen:control_box", [" T ","LMR"," B "], {
        T:[{item:'minecraft:red_dye'},{item:'minecraft:redstone'}],
        L:[{item:'tconstruct:copper_nugget'},{item:'minecraft:lime_dye'},{item:'minecraft:green_dye'},{item:'tconstruct:greenheart_log'},{item:'minecraft:emerald'}],
        M:'minecraft:smooth_stone',
        R:[{item:'minecraft:blue_dye'},{item:'minecraft:lapis_lazuli'},{item:'tconstruct:cobalt_nugget'}],
        B:[{item:'minecraft:yellow_dye'},{item:'minecraft:gold_nugget'}]
    });

    // Cheaper starting recipes
    event.remove({ id: "minecraft:hopper" });
    event.shaped("minecraft:hopper", ["A A", "A A", " A "], {
        A:[{ item: "create:andesite_alloy" }, { item: "minecraft:iron_ingot" }, { item: "create:zinc_ingot" }]
    });

    // Cheaper starting items
    event.remove({ id: "minecraft:shears" });
    event.shaped("minecraft:shears", ["A ", " A"], {
        A:[{ item: "create:andesite_alloy" }, { item: "minecraft:iron_ingot" }, { item: "create:zinc_ingot" }, { item: "minecraft:copper_ingot" }, { item: "minecraft:iron_ingot" }]
    });

    event.remove({ id: "minecraft:bucket" });
    event.shaped("minecraft:bucket", ["   ", "A A", " B "], {
        A:[{ item: "create:andesite_alloy" }, { item: "create:zinc_ingot" }, { item: "minecraft:iron_ingot" }, { item: "minecraft:copper_ingot" }],
        B:[{ item: "create:andesite_alloy" }, { item: "create:zinc_ingot" }, { item: "minecraft:iron_ingot" }, ],

    });

    event.remove({ id: "minecraft:cauldron" });
    event.shaped("minecraft:cauldron", ["A A", "A A", "AAA"], {
        A:[{ item: "minecraft:copper_ingot" }, { item: "create:zinc_ingot" }, { item: "create:andesite_alloy" }, { item: "minecraft:iron_ingot" },]
    });

    event.blasting("minecraft:coal", "minecraft:charcoal");

    for (const m of [
        {
            n: "iron",
            nugget: "minecraft:iron_nugget",
            fluid: "tconstruct:molten_iron",
        },
        {
            n: "copper",
            nugget: "create:copper_nugget",
            fluid: "tconstruct:molten_copper",
        },
        {
            n: "zinc",
            nugget: "create:zinc_nugget",
            fluid: "tconstruct:molten_zinc",
        },
        {
            n: "gold",
            nugget: "minecraft:gold_nugget",
            fluid: "tconstruct:molten_gold",
        },
        {
            n: "silver",
            nugget: "occultism:silver_nugget",
            fluid: "tconstruct:molten_silver",
        },
        {
            n: "cobalt",
            nugget: "tconstruct:cobalt_nugget",
            fluid: "tconstruct:molten_cobalt",
        },
        {
            n: "redstone",
            inpureDust: "create_modpack_glue:inpure_redstone_dust",
            washingResults: [
                { n: "minecraft:redstone", p: 0.1 },
                { n: "minecraft:gunpowder", p: 0.01 },
            ],
        },
        {
            n: "diamond",
            inpureDust: "create_modpack_glue:inpure_diamond_dust",
            washingResults: [
                { n: "create_modpack_glue:diamond_dust", p: 0.03, fluid: "tconstruct:molten_diamond", fluidAmount: 3 },
                { n: "minecraft:gunpowder", p: 0.1 },
            ],
        },
        {
            n: "emerald",
            inpureDust: "create_modpack_glue:inpure_emerald_dust",
            washingResults: [
                { n: "create_modpack_glue:emerald_dust", p: 0.01, fluid: "tconstruct:molten_emerald", fluidAmount: 3 },
                { n: "minecraft:gunpowder", p: 0.1 },
            ],
        },
    ]) {
        if (!m.inpureDust) {
            event.recipes.create.milling({
                type: "create:milling",
                ingredients: [
                    {
                        item: `create_modpack_glue:raw_poor_${m.n}_ore`,
                    },
                ],
                results: [
                    {
                        item: `create_modpack_glue:${m.n}_grain`,
                    },
                ],
                processingTime: 300,
            });

            event.shaped(`create_modpack_glue:${m.n}_grain`, ["A  ", " A ", "  A"], {
                A:[{ item: `create_modpack_glue:raw_poor_${m.n}_ore` },]
            });

            event.recipes.create.crushing({
                ingredients: [{ item: `create_modpack_glue:raw_poor_${m.n}_ore` }],
                results: [{ item: `create_modpack_glue:${m.n}_grain` }, { item: `create_modpack_glue:${m.n}_grain`, chance: 0.2 }],
                processingTime: 30,
            });

            if (m.nugget) {
                event.shaped(m.nugget, ["A  ", " A ", "  A"], {
                    A:[{ item: `create_modpack_glue:raw_${m.n}_nugget`,}]
                });

                event.recipes.create.milling({
                    type: "create:milling",
                    ingredients: [
                        {
                            item: `create_modpack_glue:raw_${m.n}_nugget`,
                        },
                    ],
                    results: [
                        {
                            item: m.nugget,
                        },
                    ],
                    processingTime: 1000,
                });

                // event.smelting(m.nugget, `create_modpack_glue:raw_${m.n}_nugget`);
                // event.recipes.minecraft.blasting(m.nugget, `create_modpack_glue:raw_${m.n}_nugget`);
                event.shaped("minecraft:hopper", ["A A", "A A", " A "], {
                    A:[{ item: "create:andesite_alloy" }, { item: "minecraft:iron_ingot" }, { item: "create:zinc_ingot" }]
                });

                event.recipes.create.crushing({
                    ingredients: [{ item: `create_modpack_glue:raw_${m.n}_nugget` }],
                    results: [{ item: m.nugget }, { item: m.nugget, chance: 0.2 }],
                    processingTime: 100,
                });
            }
        } else {
            event.recipes.create.milling({
                type: "create:milling",
                ingredients: [
                    {
                        item: `create_modpack_glue:raw_poor_${m.n}_ore`,
                    },
                ],
                results: [
                    {
                        item: m.inpureDust,
                    },
                ],
                processingTime: 300,
            });

            event.recipes.create.crushing({
                ingredients: [{ item: `create_modpack_glue:raw_poor_${m.n}_ore` }],
                results: [{ item: m.inpureDust }, { item: m.inpureDust, chance: 0.2 }],
                processingTime: 30,
            });
        }

        if (m.nugget) {
            event.shaped(m.nugget, ["GGG", "GGG", "GGG"], {
                G: `create_modpack_glue:${m.n}_grain`,
            });
        }

        if (!m.washingResults) {
            event.custom({
                type: "tconstruct:melting",
                ingredient: {
                    item: `create_modpack_glue:${m.n}_grain`,
                },
                result: {
                    fluid: m.fluid,
                    amount: 2,
                },
                temperature: 800,
                time: 50,
            });

            event.custom({
                type: "tconstruct:melting",
                ingredient: {
                    item: `create_modpack_glue:raw_poor_${m.n}_ore`,
                },
                result: {
                    fluid: m.fluid,
                    amount: 1,
                },
                temperature: 800,
                time: 150,
            });
        } else {
            event.custom({
                type: "create:splashing",
                ingredients: [
                    {
                        item: `create_modpack_glue:inpure_${m.n}_dust`,
                    },
                ],
                results: m.washingResults.map((it) => ({ item: it.n, chance: it.p })),
            });

            for (let it of m.washingResults) {
                if (!it.fluid) {
                    continue;
                }
                event.custom({
                    type: "tconstruct:melting",
                    ingredient: {
                        item: it.n,
                    },
                    result: {
                        fluid: it.fluid,
                        amount: it.fluidAmount,
                    },
                    temperature: 800,
                    time: 150,
                });
            }
        }
    }

    // For iron tools & weapons
    event.recipes.create.pressing({
        ingredients: [{ item: "minecraft:kelp_block" }],
        results: [{ item: "create:belt", count: 2 }],
        processingTime: 300,
    });


    //  event.recipes.create.crushing([item.of('mekanism:dust_quartz').chance(0.5)], 'minecraft:quartz', 100);

    // event.recipes.create.crushing([item.of('mekanism:dust_quartz')], 'minecraft:quartz', 100);
    // event.recipes.create.crushing([item.of('mekanism:dust_diamond')], 'minecraft:diamond', 100);

    //event.recipes.create.compressing('minecraft:iron_block', 'minecraft:netherite_block');
    //event.recipes.create.crushing(['minecraft:apple', item.of('minecraft:carrot').chance(0.5)], 'minecraft:apple', 100)
});

onEvent("item.tags", (event) => {
    // Get the #forge:cobblestone tag collection and add Diamond Ore to it
    // event.get('forge:cobblestone').add('minecraft:diamond_ore')
    // Get the #forge:cobblestone tag collection and remove Mossy Cobblestone from it
    // event.get('forge:cobblestone').remove('minecraft:mossy_cobblestone')
});

// Listen to player login event
onEvent("player.logged_in", (event) => {
    // console.info('Yya player.logged_in 000000023')
    // Check if player doesn't have "starting_items" stage yet
    if (!event.player.stages.has("starting_items")) {
        // console.info(`Yya player.logged_in 000000024 ${Object.keys(event.player).join(',')}`)
        // console.info(`Yya player.logged_in 000000025 name = ${(event.player.getName())}`)

        // Add the stage
        event.player.stages.add("starting_items");

        let giveItems = (name, count) => {
            for (let i = 0; i < count; i++) {
                event.player.give(name);
            }
        };

        // if (event.player.getName() === "lordodin") {
        //   giveItems("create:cogwheel", 3);
        //   giveItems("create:large_cogwheel", 2);
        //   giveItems("create:shaft", 2);
        //   giveItems("create:mechanical_crafter", 9);
        //   giveItems("chunkloaders:ultimate_chunk_loader", 1);
        //   giveItems("minecraft:salmon", 64); // +
        //   giveItems("create:hand_crank", 1); // +
        // }

        // Give some items to player
        giveItems("create:crafter_slot_cover", 9); // +
        // giveItems("minecraft:nether_wart", 1);
        // giveItems("minecraft:soul_sand", 4);
        giveItems("minecraft:chest", 4);
        giveItems("minecraft:salmon", 16); // +
        giveItems("minecraft:torch", 30); // +
        giveItems("chunkloaders:basic_chunk_loader", 1);
    }
});

onEvent("entity.loot_tables", (event) => {
    // Disable iron_golem drops
    event.addEntity("minecraft:iron_golem", (table) => {
        table.clearPools();
    });
});

// Listen to fluid tag event
onEvent("fluid.tags", (event) => {
    // event.add(
    //   "minecraft:lava",
    //   "minecraft:lava"
    // );
    // event.add(
    //   "forge:lava",
    //   "forge:lava"
    // );
    event.add("create_modpack_glue:molten_cleaner", "create_modpack_glue:molten_cleaner");
    event.add("create_modpack_glue:adv_molten_cleaner", "create_modpack_glue:adv_molten_cleaner");
    event.add("create_modpack_glue:weapon_molted_iron", "create_modpack_glue:weapon_molted_iron");
    event.add("create_modpack_glue:weapon_molted_steel", "create_modpack_glue:weapon_molted_steel");
    event.add("create_modpack_glue:weapon_molted_diamond", "create_modpack_glue:weapon_molted_diamond");
});
