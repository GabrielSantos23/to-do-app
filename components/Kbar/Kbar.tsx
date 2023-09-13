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

import { Search } from 'lucide-react';

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
  return (
    <KBarPortal>
      <KBarPositioner className='p-2 backdrop-blur-sm  flex items-center z-[10000]'>
        <KBarAnimator
          className={`  w-[550px] overflow-hidden p-2  rounded-xl mb-10 opacity-0 backdrop-blur-md bg-black`}
        >
          <div className='flex items-center'>
            <Search
              className={` w-7 ml-2
            
            `}
            />
            <KBarSearch className={`flex px-4 w-full h-16 outline-none   `} />
            <div
              className={`text-[#BCBCBC] mr-4 px-2 flex items-center pb-1  cursor-default rounded-lg  `}
            >
              esc
            </div>
          </div>
          <div className='pb-10'>
            <RenderResults />
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
    <div className={active ? `` : undefined}>
      <div
        ref={ref}
        className={`${
          active ? 'active rounded-lg  ' : 'transparent'
        } 'rounded-lg px-4 py-2 flex items-center cursor-pointer justify-between  `}
      >
        <div className={`flex items-center gap-2 text-base }`}>
          <div className='flex flex-col'>
            <div>
              {ancestors.length > 0 &&
                ancestors.map((ancestor) => (
                  <React.Fragment key={ancestor.id}>
                    <span className='mr-4 opacity-50'>{action.name}</span>

                    <span className='mr-4'>&rsaquo;</span>
                  </React.Fragment>
                ))}
              <div
                className={`${
                  action?.icon ? 'flex items-center gap-2 mt-2' : ''
                }`}
              >
                <span>{action?.icon}</span>
                <span>{action.name}</span>
              </div>
            </div>
            {action.subtitle && (
              <span className='text-sm'>{action.subtitle}</span>
            )}
          </div>
        </div>
        {action.shortcut?.length ? (
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
        ) : null}
      </div>
    </div>
  );
});
