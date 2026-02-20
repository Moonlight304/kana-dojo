'use client';
import clsx from 'clsx';
import usePreferencesStore from '@/features/Preferences/store/usePreferencesStore';
import { buttonBorderStyles } from '@/shared/lib/styles';
import { CURSOR_TRAIL_EFFECTS, CLICK_EFFECTS } from '../data/effectsData';
import CollapsibleSection from './CollapsibleSection';
import { MousePointer2, Zap } from 'lucide-react';

const CLICK_EFFECT_MANUAL_ORDER = [
  'none',
  'firework',
  'sakura',
  'torii',
  'festival',
  'wave',
  'dango',
  'lantern',
  'fan',
  'fish',
  'sparkle',
  'lotus',
  'maple',
  'tea',
  'blossom',
  'wind',
  'star',
  'bamboo',
  'butterfly',
  'snowflake',
  'fuji',
  'rice',
] as const;

const clickEffectById = new Map(CLICK_EFFECTS.map(effect => [effect.id, effect]));
const ORDERED_CLICK_EFFECTS = CLICK_EFFECT_MANUAL_ORDER.map(
  id => clickEffectById.get(id)!,
);

const EMOJI_RAIN_POSITIONS = [
  { top: '-22%', left: '-10%', size: 'text-xl', opacity: 'opacity-70' },
  { top: '-12%', left: '34%', size: 'text-2xl', opacity: 'opacity-80' },
  { top: '-18%', left: '76%', size: 'text-xl', opacity: 'opacity-65' },
  { top: '14%', left: '-14%', size: 'text-2xl', opacity: 'opacity-75' },
  { top: '16%', left: '24%', size: 'text-xl', opacity: 'opacity-90' },
  { top: '10%', left: '66%', size: 'text-2xl', opacity: 'opacity-80' },
  { top: '48%', left: '4%', size: 'text-xl', opacity: 'opacity-75' },
  { top: '54%', left: '44%', size: 'text-2xl', opacity: 'opacity-90' },
  { top: '46%', left: '88%', size: 'text-xl', opacity: 'opacity-70' },
  { top: '82%', left: '-8%', size: 'text-xl', opacity: 'opacity-65' },
  { top: '88%', left: '30%', size: 'text-2xl', opacity: 'opacity-80' },
  { top: '86%', left: '72%', size: 'text-xl', opacity: 'opacity-70' },
  { top: '96%', left: '98%', size: 'text-2xl', opacity: 'opacity-75' },
] as const;

function getStableOffset(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return hash % EMOJI_RAIN_POSITIONS.length;
}

// ─── Effect card ─────────────────────────────────────────────────────────────

function EffectCard({
  name,
  emoji,
  isSelected,
  onSelect,
  group,
}: {
  name: string;
  emoji: string;
  isSelected: boolean;
  onSelect: () => void;
  group: 'cursor-trail' | 'click';
}) {
  const rainEmoji = emoji || '•';
  const offset = getStableOffset(`${group}-${name}`);

  return (
    <label
      className={clsx(
        'relative h-20 overflow-hidden',
        buttonBorderStyles,
        'border-1 border-(--card-color)',
        'cursor-pointer px-2 py-2.5',
      )}
      style={{
        outline: isSelected ? '3px solid var(--secondary-color)' : 'none',
        transition: 'background-color 275ms',
      }}
    >
      <input
        type='radio'
        name={`effect-${group}`}
        className='hidden'
        onChange={onSelect}
        checked={isSelected}
        aria-label={name}
      />
      {EMOJI_RAIN_POSITIONS.map((slot, i) => {
        const p = EMOJI_RAIN_POSITIONS[
          (i + offset) % EMOJI_RAIN_POSITIONS.length
        ];
        return (
          <span
            key={`${group}-${name}-${i}`}
            className={clsx(
              'pointer-events-none absolute leading-none select-none',
              p.size,
              p.opacity,
            )}
            style={{ top: p.top, left: p.left }}
            aria-hidden='true'
          >
            {rainEmoji}
          </span>
        );
      })}
    </label>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const Effects = () => {
  const cursorTrailEffect = usePreferencesStore(s => s.cursorTrailEffect);
  const setCursorTrailEffect = usePreferencesStore(s => s.setCursorTrailEffect);
  const clickEffect = usePreferencesStore(s => s.clickEffect);
  const setClickEffect = usePreferencesStore(s => s.setClickEffect);

  return (
    <div className='flex flex-col gap-6'>
      {/* Cursor Trail — desktop only */}
      <CollapsibleSection
        title={
          <span className='flex items-center gap-2'>
            Cursor Trail
            <span className='rounded-md bg-(--card-color) px-1.5 py-0.5 text-xs text-(--secondary-color)'>
              desktop only
            </span>
          </span>
        }
        icon={<MousePointer2 size={18} />}
        level='subsubsection'
        defaultOpen={true}
        storageKey='prefs-effects-cursor'
      >
        <fieldset className='grid grid-cols-3 gap-2 p-1 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6'>
          {CURSOR_TRAIL_EFFECTS.map(effect => (
            <EffectCard
              key={effect.id}
              name={effect.name}
              emoji={effect.emoji}
              isSelected={cursorTrailEffect === effect.id}
              onSelect={() => setCursorTrailEffect(effect.id)}
              group='cursor-trail'
            />
          ))}
        </fieldset>
      </CollapsibleSection>

      {/* Click / Tap Effects — all devices */}
      <CollapsibleSection
        title='Click Effects'
        icon={<Zap size={18} />}
        level='subsubsection'
        defaultOpen={true}
        storageKey='prefs-effects-click'
      >
        <fieldset className='grid grid-cols-3 gap-2 p-1 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6'>
          {ORDERED_CLICK_EFFECTS.map(effect => (
            <EffectCard
              key={effect.id}
              name={effect.name}
              emoji={effect.emoji}
              isSelected={clickEffect === effect.id}
              onSelect={() => setClickEffect(effect.id)}
              group='click'
            />
          ))}
        </fieldset>
      </CollapsibleSection>
    </div>
  );
};

export default Effects;
