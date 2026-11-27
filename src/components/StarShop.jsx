import React, { useState } from 'react';
import { Star, Sparkles, Check, Target, ShoppingBag, Rocket, Crown } from 'lucide-react';
import { SHOP_CATEGORIES, SHOP_ITEMS, getShopItemById } from '../data/starShopData';
import { playSound } from '../utils/audio';
import { triggerConfetti, triggerStarBurst } from '../utils/confetti';
import { tr } from '../utils/i18n';
import { speakPersonalText } from '../utils/personalize';

const RARITY_STYLES = {
  common: {
    border: 'border-sky-300',
    badgeBg: 'bg-sky-100 text-sky-900',
    labelHe: 'קְלָאסִי',
    labelEn: 'Classic',
    labelEs: 'Clásico'
  },
  rare: {
    border: 'border-indigo-400',
    badgeBg: 'bg-indigo-100 text-indigo-900',
    labelHe: 'נָדִיר ✨',
    labelEn: 'Rare ✨',
    labelEs: 'Raro ✨'
  },
  epic: {
    border: 'border-fuchsia-400',
    badgeBg: 'bg-fuchsia-100 text-fuchsia-900',
    labelHe: 'אַפִּי 🔥',
    labelEn: 'Epic 🔥',
    labelEs: 'Épico 🔥'
  },
  legendary: {
    border: 'border-amber-400',
    badgeBg: 'bg-gradient-to-r from-amber-200 to-yellow-200 text-amber-950',
    labelHe: 'אַגָּדִי 👑',
    labelEn: 'Legendary 👑',
    labelEs: 'Legendario 👑'
  }
};

export default function StarShop({
  lang,
  soundEnabled,
  kidName = '',
  stars = 0,
  activeAvatar = '',
  shopEntry,
  onBuyItem,
  onEquipItem,
  onSetWishlist,
  onGoPlay
}) {
  const isHe = lang === 'he';
  const [activeCategory, setActiveCategory] = useState('avatars');
  const [recentBanner, setRecentBanner] = useState(null);

  const ownedSet = new Set(shopEntry?.ownedIds || ['theme_classic']);
  const totalOwned = ownedSet.size;
  const totalItems = SHOP_ITEMS.length;

  const wishlistItem = shopEntry?.wishlistId ? getShopItemById(shopEntry.wishlistId) : null;
  // If no explicit wishlist yet, highlight the next closest unowned item to motivate the child!
  const suggestedGoal =
    wishlistItem ||
    [...SHOP_ITEMS]
      .filter((i) => !ownedSet.has(i.id))
      .sort((a, b) => a.price - b.price)[0] ||
    null;

  const goalNeeded = suggestedGoal ? Math.max(0, suggestedGoal.price - stars) : 0;
  const goalPct = suggestedGoal ? Math.min(100, Math.round((stars / Math.max(1, suggestedGoal.price)) * 100)) : 100;
  const canAffordGoal = suggestedGoal ? stars >= suggestedGoal.price : false;

  const isItemEquipped = (item) => {
    if (item.category === 'avatars') return activeAvatar === item.icon;
    if (item.category === 'themes') return (shopEntry?.equippedTheme || 'theme_classic') === item.id;
    if (item.category === 'pets') return shopEntry?.equippedPet === item.id;
    if (item.category === 'badges') return shopEntry?.equippedBadge === item.id;
    return false;
  };

  const handleBuy = (item, e) => {
    const itemName = tr(lang, item.nameHe, item.nameEn, item.nameEs);
    if (stars < item.price) {
      const missing = item.price - stars;
      playSound('whoosh');
      setRecentBanner({
        type: 'encourage',
        text: tr(
          lang,
          kidName
            ? `כִּמְעַט ${kidName}! חֲסֵרִים רַק עוֹד ${missing} כּוֹכָבִים בִּשְׁבִיל "${itemName}" — שַׂחֵק מִשְׂחָק וְתַשִּׂיג אֶת זֶה!`
            : `כִּמְעַט! חֲסֵרִים רַק עוֹד ${missing} כּוֹכָבִים בִּשְׁבִיל "${itemName}" — בּוֹאוּ לְשַׂחֵק וּלְהַרְוִיחַ כּוֹכָבִים!`,
          kidName
            ? `Almost there, ${kidName}! Only ${missing} more stars needed for "${itemName}" — play a game to earn them!`
            : `Almost there! Just ${missing} more stars for "${itemName}" — play a game to earn them!`,
          kidName
            ? `¡Casi listo, ${kidName}! Solo faltan ${missing} estrellas para "${itemName}" — ¡juega para ganarlas!`
            : `¡Casi listo! Faltan ${missing} estrellas para "${itemName}" — ¡juega para ganarlas!`
        )
      });
      return;
    }

    onBuyItem(item);
    playSound('win');
    triggerConfetti({ x: 0.5, y: 0.5 });
    if (e?.currentTarget) {
      const r = e.currentTarget.getBoundingClientRect();
      triggerStarBurst(r.left + r.width / 2, r.top + r.height / 2);
    }

    const msg = tr(
      lang,
      kidName
        ? `יֵשׁ! ${kidName}, קָנִיתָ אֶת "${itemName}" וְהוּא כְּבָר מֻפְעָל! 🎉`
        : `יֵשׁ! קָנִיתָ אֶת "${itemName}" וְהוּא כְּבָר מֻפְעָל! 🎉`,
      kidName
        ? `Woohoo, ${kidName}! You unlocked "${itemName}" and equipped it! 🎉`
        : `Woohoo! You unlocked "${itemName}" and equipped it! 🎉`,
      kidName
        ? `¡Genial, ${kidName}! ¡Desbloqueaste "${itemName}" y ya está equipado! 🎉`
        : `¡Genial! ¡Desbloqueaste "${itemName}" y ya está equipado! 🎉`
    );

    setRecentBanner({ type: 'bought', text: msg });
    if (soundEnabled) {
      speakPersonalText(msg, lang);
    }
  };

  const visibleItems = SHOP_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-5 pt-4 pb-10 flex flex-col gap-5" dir={isHe ? 'rtl' : 'ltr'}>
      {/* Hero Header Banner */}
      <div className="rounded-3xl p-5 sm:p-6 bg-gradient-to-r from-amber-400 via-orange-400 to-pink-500 text-white border-4 border-amber-200 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/25 backdrop-blur-sm border-2 border-white/50 flex items-center justify-center text-4xl shadow-inner flex-shrink-0">
              🛍️
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black leading-tight drop-shadow-xs">
                {tr(
                  lang,
                  kidName ? `חֲנוּת הַכּוֹכָבִים שֶׁל ${kidName} ⭐` : 'חֲנוּת הַכּוֹכָבִים ⭐',
                  kidName ? `${kidName}’s Star Shop ⭐` : 'Star Shop ⭐',
                  kidName ? `Tienda de Estrellas de ${kidName} ⭐` : 'Tienda de Estrellas ⭐'
                )}
              </h2>
              <p className="text-xs sm:text-sm font-bold text-white/95 mt-0.5">
                {tr(
                  lang,
                  'הַרְוִיחוּ כּוֹכָבִים בַּמִּשְׂחָקִים וְקִנוּ דְּמוּיוֹת נְדִירוֹת, חַיּוֹת מַחְמָד וְעוֹלָמוֹת קְסוּמִים!',
                  'Earn stars by playing games and unlock rare avatars, companion pets, app worlds & hero titles!',
                  '¡Gana estrellas jugando y desbloquea avatares raros, mascotas, temas y títulos!'
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="bg-white/95 text-amber-950 px-4 py-2.5 rounded-2xl border-2 border-amber-300 shadow-md flex items-center gap-2">
              <Star className="w-6 h-6 text-amber-500 fill-amber-400" />
              <div className="leading-none">
                <div className="text-[10px] font-black uppercase text-amber-700">
                  {tr(lang, 'הַכּוֹכָבִים שֶׁלִּי', 'My Stars', 'Mis Estrellas')}
                </div>
                <div className="text-2xl font-black">
                  <bdi dir="ltr">{stars}</bdi>
                </div>
              </div>
            </div>

            <div className="bg-white/20 backdrop-blur-sm px-3.5 py-2.5 rounded-2xl border-2 border-white/40 text-center leading-none">
              <div className="text-[10px] font-black text-white/90">
                {tr(lang, 'בָּאֹסֶף', 'Owned', 'Colección')}
              </div>
              <div className="text-lg font-black mt-0.5">
                <bdi dir="ltr">
                  {totalOwned}/{totalItems}
                </bdi>
              </div>
            </div>
          </div>
        </div>

        {/* Dream Goal Motivation Bar */}
        {suggestedGoal && (
          <div className="mt-4 bg-white/95 text-slate-900 rounded-2xl p-3.5 sm:p-4 border-2 border-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 w-full sm:flex-1">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-3xl flex-shrink-0">
                {suggestedGoal.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="inline-flex items-center gap-1 text-[11px] font-black px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                    <Target className="w-3 h-3" />
                    {wishlistItem
                      ? tr(lang, 'הַיַּעַד שֶׁלִּי', 'My Dream Goal', 'Mi Meta')
                      : tr(lang, 'הַפְּרָס הַקָּרוֹב', 'Next Prize', 'Próximo Premio')}
                  </span>
                  <span className="font-black text-sm sm:text-base text-slate-900 truncate">
                    {tr(lang, suggestedGoal.nameHe, suggestedGoal.nameEn, suggestedGoal.nameEs)}
                  </span>
                </div>

                <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden mt-1.5 border border-slate-300">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      canAffordGoal
                        ? 'bg-gradient-to-r from-emerald-400 to-teal-500'
                        : 'bg-gradient-to-r from-amber-400 to-orange-500'
                    }`}
                    style={{ width: `${goalPct}%` }}
                  />
                </div>

                <div className="text-xs font-extrabold mt-1 text-slate-600">
                  {canAffordGoal
                    ? tr(
                        lang,
                        `🎉 יֵשׁ לְךָ מַסְפִּיק כּוֹכָבִים! אֶפְשָׁר לִקְנוֹת עַכְשָׁו!`,
                        `🎉 You have enough stars! Unlock it right now!`,
                        `🎉 ¡Ya tienes suficientes estrellas! ¡Cómpralo ahora!`
                      )
                    : tr(
                        lang,
                        `עוֹד ${goalNeeded} כּוֹכָבִים בִּלְבַד (${stars}/${suggestedGoal.price} ⭐) — שַׂחֵק מִשְׂחָק וְתַשִּׂיג אֶת זֶה!`,
                        `Only ${goalNeeded} more stars to go (${stars}/${suggestedGoal.price} ⭐) — play a game to earn them!`,
                        `¡Solo faltan ${goalNeeded} estrellas (${stars}/${suggestedGoal.price} ⭐)! ¡Juega para ganarlas!`
                      )}
                </div>
              </div>
            </div>

            {canAffordGoal ? (
              <button
                type="button"
                onClick={(e) => handleBuy(suggestedGoal, e)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-sm flex items-center justify-center gap-1.5 shadow-md btn-press-3d cursor-pointer flex-shrink-0"
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {tr(lang, `קְנֵה בְּ-${suggestedGoal.price} ⭐`, `Buy for ${suggestedGoal.price} ⭐`, `Comprar (${suggestedGoal.price} ⭐)`)}
                </span>
              </button>
            ) : (
              onGoPlay && (
                <button
                  type="button"
                  onClick={() => {
                    playSound('pop');
                    onGoPlay();
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md btn-press-3d cursor-pointer flex-shrink-0"
                >
                  <Rocket className="w-4 h-4" />
                  <span>{tr(lang, 'שַׂחֵק וְהַרְוַח כּוֹכָבִים!', 'Play & Earn Stars!', '¡Juega y gana estrellas!')}</span>
                </button>
              )
            )}
          </div>
        )}
      </div>

      {/* Purchase Celebration / Encouragement Banner */}
      {recentBanner && (
        <div
          className={`rounded-2xl p-3.5 sm:p-4 border-2 flex flex-wrap items-center justify-between gap-3 animate-pop-in ${
            recentBanner.type === 'bought'
              ? 'bg-emerald-100 border-emerald-400 text-emerald-950'
              : 'bg-amber-100 border-amber-400 text-amber-950'
          }`}
        >
          <span className="font-black text-sm sm:text-base">{recentBanner.text}</span>
          {recentBanner.type === 'encourage' && onGoPlay && (
            <button
              type="button"
              onClick={() => {
                playSound('pop');
                onGoPlay();
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 btn-press-3d cursor-pointer"
            >
              <Rocket className="w-4 h-4" />
              <span>{tr(lang, 'לַמִּשְׂחָקִים 🚀', 'Go Play 🚀', 'Ir a jugar 🚀')}</span>
            </button>
          )}
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {SHOP_CATEGORIES.map((cat) => {
          const active = activeCategory === cat.id;
          const catItems = SHOP_ITEMS.filter((i) => i.category === cat.id);
          const catOwned = catItems.filter((i) => ownedSet.has(i.id)).length;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                playSound('pop');
                setActiveCategory(cat.id);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-sm border-2 transition btn-press-3d cursor-pointer ${
                active
                  ? 'bg-indigo-600 text-white border-indigo-700 shadow-md scale-[1.03]'
                  : 'bg-white text-slate-800 border-slate-200 hover:bg-indigo-50'
              }`}
            >
              <span className="text-xl">{cat.icon}</span>
              <span>{tr(lang, cat.he, cat.en, cat.es)}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
                  active ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <bdi dir="ltr">
                  {catOwned}/{catItems.length}
                </bdi>
              </span>
            </button>
          );
        })}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {visibleItems.map((item) => {
          const owned = ownedSet.has(item.id);
          const equipped = isItemEquipped(item);
          const isPinned = shopEntry?.wishlistId === item.id;
          const canAfford = stars >= item.price;
          const missing = Math.max(0, item.price - stars);
          const pct = Math.min(100, Math.round((stars / Math.max(1, item.price)) * 100));
          const rarity = RARITY_STYLES[item.rarity] || RARITY_STYLES.common;
          const itemName = tr(lang, item.nameHe, item.nameEn, item.nameEs);
          const itemDesc = tr(lang, item.descHe, item.descEn, item.descEs);

          return (
            <div
              key={item.id}
              className={`bg-white rounded-3xl border-4 p-4 flex flex-col justify-between gap-3 shadow-md transition hover:shadow-lg ${
                equipped
                  ? 'border-emerald-400 ring-2 ring-emerald-200'
                  : isPinned
                    ? 'border-indigo-400 ring-2 ring-indigo-200'
                    : rarity.border
              }`}
            >
              {/* Top row: rarity + goal/owned status */}
              <div className="flex items-center justify-between gap-1">
                <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full ${rarity.badgeBg}`}>
                  {tr(lang, rarity.labelHe, rarity.labelEn, rarity.labelEs)}
                </span>
                {equipped ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    <Check className="w-3 h-3" />
                    {tr(lang, 'מֻפְעָל', 'Equipped', 'Activo')}
                  </span>
                ) : owned ? (
                  <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {tr(lang, 'שֶׁלְּךָ ✓', 'Owned ✓', 'Tuyo ✓')}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-0.5 text-xs font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-950 border border-amber-300">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                    <bdi dir="ltr">{item.price}</bdi>
                  </span>
                )}
              </div>

              {/* Preview Icon / Theme Swatch */}
              <div className="flex flex-col items-center text-center gap-1.5 py-1">
                {item.category === 'themes' ? (
                  <div
                    className={`w-full h-20 rounded-2xl bg-gradient-to-r ${item.previewClass} border-2 border-white shadow-inner flex items-center justify-center text-4xl`}
                  >
                    {item.icon}
                  </div>
                ) : (
                  <div
                    className={`w-20 h-20 rounded-3xl flex items-center justify-center text-5xl border-2 shadow-inner ${
                      item.rarity === 'legendary'
                        ? 'bg-gradient-to-tr from-amber-100 to-yellow-200 border-amber-300'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    {item.icon}
                  </div>
                )}

                <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight mt-1">
                  {itemName}
                </h3>
                <p className="text-xs font-bold text-slate-500 leading-snug">{itemDesc}</p>
              </div>

              {/* Action Controls */}
              <div className="flex flex-col gap-1.5">
                {owned ? (
                  <button
                    type="button"
                    onClick={() => {
                      playSound('pop');
                      onEquipItem(item);
                    }}
                    className={`w-full py-2.5 px-3 rounded-2xl font-black text-xs sm:text-sm border-2 btn-press-3d cursor-pointer transition ${
                      equipped
                        ? item.category === 'pets' || item.category === 'badges'
                          ? 'bg-emerald-100 hover:bg-slate-100 border-emerald-400 text-emerald-900'
                          : 'bg-emerald-500 border-emerald-600 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-700 border-indigo-700 text-white shadow-sm'
                    }`}
                  >
                    {equipped
                      ? item.category === 'pets' || item.category === 'badges'
                        ? tr(lang, 'מֻפְעָל ✓ (הָסֵר)', 'Equipped ✓ (Remove)', 'Activo ✓ (Quitar)')
                        : tr(lang, 'מֻפְעָל עַכְשָׁו ✓', 'Active Now ✓', 'Activo ✓')
                      : tr(lang, 'הַפְעֵל עַכְשָׁו ✨', 'Equip Now ✨', 'Equipar ✨')}
                  </button>
                ) : canAfford ? (
                  <button
                    type="button"
                    onClick={(e) => handleBuy(item, e)}
                    className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-black text-sm flex items-center justify-center gap-1.5 shadow-md btn-press-3d cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>
                      {tr(lang, `קְנֵה בְּ-${item.price} ⭐`, `Buy (${item.price} ⭐)`, `Comprar (${item.price} ⭐)`)}
                    </span>
                  </button>
                ) : (
                  <>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleBuy(item, e)}
                      className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-amber-50 border border-slate-300 text-slate-700 font-black text-xs cursor-pointer"
                    >
                      {tr(lang, `עוֹד ${missing} ⭐ לִקְנִיָּה`, `Need ${missing} more ⭐`, `Faltan ${missing} ⭐`)}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        playSound('pop');
                        onSetWishlist(isPinned ? null : item.id);
                      }}
                      className={`w-full py-1.5 px-2.5 rounded-xl font-black text-[11px] flex items-center justify-center gap-1 border transition cursor-pointer ${
                        isPinned
                          ? 'bg-indigo-600 text-white border-indigo-700'
                          : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border-indigo-200'
                      }`}
                    >
                      <Target className="w-3.5 h-3.5" />
                      <span>
                        {isPinned
                          ? tr(lang, 'יַעַד נִבְחָר! 🎯', 'Pinned Goal! 🎯', '¡Meta fijada! 🎯')
                          : tr(lang, 'סַמֵּן כְּיַעַד שֶׁלִּי 🎯', 'Save for This! 🎯', '¡Guardar meta! 🎯')}
                      </span>
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Motivation Footer */}
      <div className="bg-indigo-50 border-2 border-indigo-200 rounded-3xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Crown className="w-8 h-8 text-amber-500 flex-shrink-0" />
          <div>
            <div className="font-black text-indigo-950 text-sm sm:text-base">
              {tr(
                lang,
                'רוֹצֶה עוֹד כּוֹכָבִים בִּמְהִירוּת? 🚀',
                'Want more stars fast? 🚀',
                '¿Quieres más estrellas rápido? 🚀'
              )}
            </div>
            <div className="text-xs font-bold text-indigo-800">
              {tr(
                lang,
                'כָּל תְּשׁוּבָה נְכוֹנָה מְבִיאָה כּוֹכָב, וְכָל מְשִׂימָה שֶׁל 5 שְׁאֵלוֹת מְבִיאָה +5 כּוֹכְבֵי בּוֹנוּס!',
                'Every correct answer earns a star, and finishing a 5-question mission gives +5 bonus stars!',
                '¡Cada respuesta correcta da una estrella y cada misión de 5 preguntas da +5 estrellas extra!'
              )}
            </div>
          </div>
        </div>
        {onGoPlay && (
          <button
            type="button"
            onClick={() => {
              playSound('pop');
              onGoPlay();
            }}
            className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm flex items-center gap-2 shadow-md btn-press-3d cursor-pointer"
          >
            <Rocket className="w-4 h-4" />
            <span>{tr(lang, 'בּוֹאוּ נְשַׂחֵק!', 'Let’s Play!', '¡A jugar!')}</span>
          </button>
        )}
      </div>
    </div>
  );
}
