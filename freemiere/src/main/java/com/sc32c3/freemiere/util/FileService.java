package com.sc32c3.freemiere.util;

import java.io.File;
import java.io.UnsupportedEncodingException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.web.multipart.MultipartFile;

/**
 * 파일 관련 유틸 업로드한 파일의 저장 & 서버에 저장된 파일 삭제 등의 기능 제공
 */

public class FileService {

	/**
	 * 업로드 된 파일을 지정된 경로에 저장하고, 저장된 파일명을 리턴
	 * 
	 * @param mfile
	 *            업로드된 파일
	 * @param path
	 *            저장할 경로
	 * @return 저장된 파일명
	 */
	public static String saveFile(MultipartFile mfile, String uploadPath) {
		// 업로드된 파일이 없거나 크기가 0이면 저장하지 않고 null을 리턴
		if (mfile == null || mfile.isEmpty() || mfile.getSize() == 0) {
			return null;
		}

		// 저장 폴더가 없으면 생성 "/boardfile"<-boardfile이라는 파일생성 후
		File path = new File(uploadPath);
		if (!path.isDirectory()) {
			path.mkdirs();
		}

		// 원본 파일명
		String originalFilename = null;
		 String fileName =null;
		try {
			originalFilename = new String(mfile.getOriginalFilename().getBytes("8859_1"), "UTF-8");
			 fileName  = originalFilename.substring( 0, originalFilename.lastIndexOf(".") ); 
		} catch (UnsupportedEncodingException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}

		// 원본 파일의 확장자
		String ext;
		int lastIndex = originalFilename.lastIndexOf('.');
		// 확장자가 없는 경우
		if (lastIndex == -1) {
			ext = "";
		}
		// 확장자가 있는 경우
		else {
			ext = "." + originalFilename.substring(lastIndex + 1);
		}

		// 저장할 전체 경로를 포함한 File 객체
		File serverFile = null;

		// 같은 이름의 파일이 있는 경우의 처리
		int count = 0;
		while (true) {
			count++;
			serverFile = new File(uploadPath + "/" + originalFilename );
			
			// 같은 이름의 파일이 없으면 나감.
			if (!serverFile.isFile())
				break;
			originalFilename = fileName+ "("+count+")"+ext;
			
			
		}

		// 파일 저장
		try {
			mfile.transferTo(serverFile);
		} catch (Exception e) {
			originalFilename = null;
			e.printStackTrace();
		}

		return originalFilename;
	}

	/**
	 * 서버에 저장된 파일의 전체 경로를 전달받아, 해당 파일을 삭제
	 * 
	 * @param fullpath
	 *            삭제할 파일의 경로
	 * @return 삭제 여부
	 */
	public static boolean deleteFile(String fullpath) {
		// 파일 삭제 여부를 리턴할 변수
		boolean result = false;

		// 전달된 전체 경로로 File객체 생성
		File delFile = new File(fullpath);

		// 해당 파일이 존재하면 삭제
		if (delFile.isFile()) {
			delFile.delete();
			result = true;
		}

		return result;
	}

}
