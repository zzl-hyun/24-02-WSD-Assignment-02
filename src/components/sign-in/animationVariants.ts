export const logoVariants = {
    start: {
      pathLength: 0,
      fill: "rgba(229, 16, 19, 0)",
      opacity: 1
    },
    end: {
      pathLength: 1,
      fill: "rgba(229, 16, 19, 1)",
      transition: {
        default: { delay: 0.5, duration: 3, ease: [1, 0, 0.8, 1] }, // 약간의 지연 후 자연스럽게 선 애니메이션
        fill: { delay: 0.5, duration: 3, ease: [1, 0, 0.8, 1] }, // 경로 애니메이션과 조화를 이루도록 시간 조정
      },
    },
    hover: {
      scale: 0.9,
      transition: {
        yoyo: Infinity,
      },
    },
  };
  
  export const logoAnimationSequence = async (
    logoControls: any,
    boxControls: any,
    setIsLoginVisible: (value: boolean) => void
  ): Promise<void> => {
    // 1. 로그인 폼 사라지는 애니메이션
    await boxControls.start({
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.2 }, // 로그인 폼이 빠르게 사라짐
    });
  
    // 2. 로그인 폼 숨김 처리
    setIsLoginVisible(false);
  
    // 3. 로고 초기 상태 설정
    await logoControls.start({
      opacity: 1,
      x: "-50%",
      y: "-50%",
      scale: 1.5, // 처음에는 약간만 확대
      transition: { duration: 3 }, // 빠르게 초기 위치로 설정
    });
  
    // 5. 로고 애니메이션 완료 (선과 채우기 동작)
    await logoControls.start("end");
  };
  