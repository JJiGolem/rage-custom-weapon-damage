const {
    ignoreWeapons,
    damageWeapons,
    damageWeaponGroups
} = require('./src/weapons/damageHandler/settings.js');

// The value from this range will determine what percentage of the original damage will be cut
const defaultPercent = {
    max: 85,
    min: 60
}

const randomInt = (min, max) => Math.random() * (max - min) + min;

const encode = (boneIndex, damage) => {
    if (boneIndex < 0 || boneIndex > 127) {
        throw new Error("boneIndex must be between 0 and 127");
    }
    if (damage < 0 || damage > 10000) {
        throw new Error("damage must be between 0 and 10000");
    }
    
    return (boneIndex & 0x7F) | ((damage & 0x3FFF) << 7);
}

const decode = (encoded) => {
    const boneIndex = encoded & 0x7F; // последние 7 бит
    const damage = (encoded >> 7) & 0x3FFF; // следующие 14 бит
    return { boneIndex, damage };
}

// need refactor
mp.events.add("incomingDamage", (sourceEntity, sourcePlayer, targetEntity, weapon, boneIndex, damage) => {
    if (targetEntity.type === "player" && sourcePlayer && !(weapon in ignoreWeapons)) {
        if (global.adminGodMode) {
            return true;
        }

        let max = defaultPercent.max;
        let min = defaultPercent.max;

        const weaponGroupHash = mp.game.weapon.getWeapontypeGroup(weapon);
        if (weapon in damageWeapons) {
            max = damageWeapons[weapon].max;
            min = damageWeapons[weapon].min;
        } else if (weaponGroupHash in damageWeaponGroups) {
            max = damageWeaponGroups[weaponGroupHash].max;
            min = damageWeaponGroups[weaponGroupHash].min;
        }

        const percent = randomInt(min, max) / 100;
        let customDamage = damage - (damage * percent);

        // Check for a hit in the head. A hit to the head carries with it much more damage than on other points of the body.
        if (boneIndex === 20) {
            customDamage /= 10;
        }

        // is bad, not do it
        targetEntity.applyDamageTo(parseInt(customDamage), true);

        const currentHealth = targetEntity.getHealth();

        // This check is necessary in order for the "PlayerDeath" event to be triggered if the player died after taking damage
        if (currentHealth > 0) {
            // Setting the initial damage received in the event to 0
            mp.game.weapon.setCurrentDamageEventAmount(0);
        }
    }
})

mp.events.add('outgoingDamage', (sourceEntity, targetEntity, sourcePlayer, weapon, boneIndex, damage) => {
    const encodeValue = encode(boneIndex, damage);
    mp.gui.chat.push(`outgoing: weapon: ${weapon}, boneIndex: ${boneIndex}, damage: ${damage}, encode: ${encodeValue}`);
    mp.game.weapon.setCurrentDamageEventAmount(encodeValue);
});

mp.events.add('incomingDamage', (sourceEntity, sourcePlayer, targetEntity, weapon, boneIndex, damage) => {
    const decodeValue = decode(damage);
    boneIndex = decodeValue.boneIndex;
    damage = decodeValue.damage;
    mp.gui.chat.push(`incoming: weapon: ${weapon}, boneIndex: ${boneIndex}, damage: ${damage}`);
    mp.game.weapon.setCurrentDamageEventAmount(damage);
});

mp.events.add('meleeActionDamage', (source, target, weaponHash, damage, isCritical) => {
	mp.gui.chat.push(`melee: weapon: ${weaponHash}, damage: ${damage}, isCritical: ${isCritical}`);
});