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

        targetEntity.applyDamageTo(parseInt(customDamage), true);

        const currentHealth = targetEntity.getHealth();

        // This check is necessary in order for the "PlayerDeath" event to be triggered if the player died after taking damage
        if (currentHealth > 0) {
            // Setting the initial damage received in the event to 0
            mp.game.weapon.setCurrentDamageEventAmount(0);
        }
    }
})