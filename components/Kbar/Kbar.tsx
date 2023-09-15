'use client';

import * as React from 'react';

import {
  KBarPortal,
  KBarPositioner,
  KBarAnimator,
  KBarSearch,
  useMatches,
  KBarResults,
  useKBar,
  ActionImpl,
  ActionId,
} from 'kbar';

import {
  ArrowUpDown,
  CornerDownLeft,
  CornerUpRight,
  Search,
} from 'lucide-react';
import { useUser } from '@/hooks/useUser';

export default function Kbar() {
  return (
    <div className=' fixed  w-full h-full  -z-10 mb-10 '>
      <CommandBar />
      <div className='flex justify-end items-end  h-full p-8'>
        {/* <CommandButton /> */}
      </div>
    </div>
  );
}

function CommandBar() {
  const { user } = useUser();
  const fullName = user?.user_metadata.full_name;
  const first = fullName ? fullName.split(' ')[0] : '';
  return (
    <KBarPortal>
      <KBarPositioner className='  bg-zinc-900 bg-opacity-50 flex items-center z-[10000]'>
        <KBarAnimator
          className={`  w-[620px] overflow-hidden   rounded-xl mb-10 opacity-0  bg-[#252525] shadow-lg  `}
        >
          <div className='flex items-center px-2 '>
            <Search
              className={` w-5 ml-2  opacity-50
            `}
            />
            <KBarSearch
              className={`flex px-4 w-full h-12 outline-none bg-transparent  `}
              defaultPlaceholder={`Search in ${first}'s List...`}
            />
          </div>
          <hr className='w-screen border-none opacity-10 bg-white h-[1px]' />
          <div className='pb-10 mt-2'>
            <RenderResults />
          </div>
          <div className='border-t-[1px] px-5 py-2 opacity-60 flex gap-2 border-white border-opacity-10'>
            <div className='flex items-center gap-2 '>
              <ArrowUpDown size={14} color='#ffffff' strokeWidth={1.5} />
              <p className='text-xs'>Select</p>
            </div>
            <div className='flex items-center gap-2 '>
              <CornerDownLeft size={14} color='#ffffff' strokeWidth={1.5} />
              <p className='text-xs'>Open</p>
            </div>
          </div>
        </KBarAnimator>
      </KBarPositioner>
    </KBarPortal>
  );
}

function CommandButton() {
  const { query } = useKBar();
  return (
    <button
      onClick={query.toggle}
      className={`flex items-center justify-center bg-transparent transition-all w-12 h-12 mr-4  rounded-md  general-ring-state`}
    >
      <svg width='22' height='22' fill='none' viewBox='0 0 18 18'>
        <path
          stroke='currentColor'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='1.5'
          d='M14.333 1a2.667 2.667 0 0 0-2.666 2.667v10.666a2.667 2.667 0 1 0 2.666-2.666H3.667a2.667 2.667 0 1 0 2.666 2.666V3.667a2.667 2.667 0 1 0-2.666 2.666h10.666a2.667 2.667 0 0 0 0-5.333Z'
        />
      </svg>
    </button>
  );
}

function RenderResults() {
  const { results, rootActionId } = useMatches();

  return (
    <>
      <KBarResults
        items={results}
        onRender={({ item, active }) =>
          typeof item === 'string' ? (
            <div className='px-4 pt-4 pb-2 font-medium text-[#BCBCBC] uppercase '>
              {item}
            </div>
          ) : (
            <ResultItem
              action={item}
              active={active}
              currentRootActionId={rootActionId!}
            />
          )
        }
      />
    </>
  );
}

const ResultItem = React.forwardRef(function ResultItem(
  {
    action,
    active,
    currentRootActionId,
  }: {
    action: ActionImpl;
    active: boolean;
    currentRootActionId: ActionId;
  },
  ref: React.Ref<HTMLDivElement>
) {
  const ancestors = React.useMemo(() => {
    if (!currentRootActionId) return action.ancestors;
    const index = action.ancestors.findIndex(
      (ancestor) => ancestor.id === currentRootActionId
    );

    return action.ancestors.slice(index + 1);
  }, [action.ancestors, currentRootActionId]);
  return (
    <div className={`${active ? `` : undefined} px-1.5`}>
      <div
        ref={ref}
        className={`${
          active ? 'active   ' : 'transparent'
        } ' rounded-lg px-4 py-2 flex items-center cursor-pointer justify-between hover:bg-[#313131] group transition duration-200  `}
      >
        <div className={`flex items-center gap-2 text-base }`}>
          <div className='flex flex-col'>
            <div className='flex items-center'>
              {ancestors.length > 0 &&
                ancestors.map((ancestor) => (
                  <React.Fragment key={ancestor.id}>
                    <span className='mr-4 opacity-50'>{action.name}</span>

                    <span className='mr-4'>&rsaquo;</span>
                  </React.Fragment>
                ))}
              <div
                className={`${action?.icon ? 'flex items-center gap-2 ' : ''}`}
              >
                <span className=' text-sm  '>{action?.icon}</span>
                <span className=' text-sm font-bold capitalize'>
                  {action.name}
                </span>
              </div>
              {action.subtitle && (
                <span className='text-sm opacity-70'>
                  &nbsp; - {action.subtitle}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className='hidden group-hover:block '>
          <CornerUpRight size={18} color='#ffffff' strokeWidth={1.5} />
        </div>
        {/* {action.shortcut?.length ? (
          <div aria-hidden className='grid grid-flow-col gap-2'>
            {action.shortcut.map((sc) => (
              <kbd
                key={sc}
                className={`px-2  pb-1 rounded-lg  `}
                style={{ border: '0.1px solid #ffffff22' }}
              >
                {sc}
              </kbd>
            ))}
          </div>
        ) : null} */}
      </div>
    </div>
  );
});
