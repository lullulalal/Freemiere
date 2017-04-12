package com.sc32c3.freemiere.dao;

import java.util.ArrayList;
import java.util.HashMap;

import org.springframework.web.multipart.MultipartFile;

import com.sc32c3.freemiere.vo.FileFolder;

public interface FileFolderMapper {
	
	
	public FileFolder getFilerFolerInfo(String path, String email);

	public ArrayList<FileFolder> getSharedList(String email);

	// public ArrayList<FileFolder> getMyStorageList(String email);
	public ArrayList<FileFolder> getTrashList(String email);

	public ArrayList<FileFolder> getSharedBookmarkList(String email);

	public ArrayList<FileFolder> getMyStorageBookmarkList(String email);

	//일반파일,폴더 삭제
	public int deleteFileFolder(int ffid);

	//즐겨찾기 추가한 파일,폴더 삭제
	public int deleteBookmarks(HashMap<String, Object>bookmarks );
	
	//공유폴더 파일 삭제
	public int deleteShare(HashMap<String, Object>shares);
	
	//업로드
	public int upload(FileFolder fileFolder);

	//새폴더(경로와 이메일 정보를 가져온다.)
	public int newDir(String path, String email);
	
	// 파일 다운로드
	public int saveFile(String path);

	//휴지통에서 완전 삭제
	public void completeDeleteFileFolder(int ffid);

	//복원
	public int restore(int ffid);
}
