// src/app/api/spec/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // VS Code 터미널에서 프론트가 보낸 JSON을 확인할 수 있습니다.
    console.log(' [Mock API] 백엔드로 수신된 데이터:', body);

    // 성공 응답 전송
    return NextResponse.json(
      { message: '성공적으로 스펙 데이터가 접수되었습니다.', data: body },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: '데이터 처리 중 에러 발생' },
      { status: 500 }
    );
  }
}