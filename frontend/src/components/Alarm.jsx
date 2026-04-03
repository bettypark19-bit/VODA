import React from 'react';

/**
 * Alarm: GNB 벨 아이콘 클릭 시 나타나는 알림 팝업 컴포넌트
 * @param {boolean} isOpen - 팝업 열림 상태
 * @param {function} onClose - 팝업 닫기 함수
 */
const Alarm = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // 테스트용 알림 데이터 (VODA 프로젝트 컨셉)
  const notifications = [
    { 
      id: 1, 
      title: "찜해둔 시리즈의 다음화가 올라왔어요!", 
      time: "방금 전", 
      img: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=200&auto=format&fit=crop",
      isNew: true 
    },
    { 
      id: 2, 
      title: "'오징어 게임' 새로운 에피소드가 공개되었습니다.", 
      time: "2시간 전", 
      img: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=200&auto=format&fit=crop",
      isNew: false 
    },
    { 
      id: 3, 
      title: "이번 주 추천 영화: 주말을 함께 할 인기작 Top 10", 
      time: "어제", 
      img: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=200&auto=format&fit=crop",
      isNew: false 
    },
  ];

  return (
    <>
      {/* 바깥 영역 클릭 시 닫기 (Overlay) */}
      <div className="fixed inset-0 z-40" onClick={onClose} />
      
      {/* 알림창 본체 (우측 상단 고정) */}
      <div className="absolute top-16 right-0 z-50 w-96 overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/90 shadow-2xl backdrop-blur-2xl transition-all animate-in fade-in zoom-in duration-200">
        
        {/* 헤더 영역 */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <span className="font-serif text-xl font-bold text-white tracking-tight">알림</span>
          <button className="text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors cursor-pointer">
            모두 삭제
          </button>
        </div>

        {/* 알림 리스트 영역 */}
        <div className="flex flex-col p-2 max-h-120 overflow-y-auto no-scrollbar">
          {notifications.length > 0 ? (
            notifications.map((noti) => (
              <div 
                key={noti.id} 
                className="group flex items-start gap-4 rounded-2xl p-4 transition-all hover:bg-white/5 cursor-pointer"
              >
                {/* 포스터 썸네일 */}
                <div className="relative shrink-0">
                  <img 
                    src={noti.img} 
                    alt="poster" 
                    className="h-24 w-18 rounded-lg object-cover shadow-lg border border-white/5" 
                  />
                  {noti.isNew && (
                    <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary-400 border-2 border-zinc-900 shadow-sm" />
                  )}
                </div>

                {/* 텍스트 정보 */}
                <div className="flex flex-col gap-1.5 py-1">
                  <p className="font-serif text-[15px] leading-snug text-zinc-200 group-hover:text-white transition-colors line-clamp-2">
                    {noti.title}
                  </p>
                  <span className="text-xs text-zinc-500 font-medium">{noti.time}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-zinc-500 font-serif">
              새로운 알림이 없습니다.
            </div>
          )}
        </div>

        {/* 푸터 영역 */}
        <button className="w-full border-t border-white/5 py-4 text-center text-sm font-medium text-zinc-500 hover:bg-white/5 hover:text-zinc-300 transition-all cursor-pointer">
          이전 알림 더보기
        </button>
      </div>
    </>
  );
};

export default Alarm;