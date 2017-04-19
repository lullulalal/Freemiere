package com.sc32c3.freemiere.dao;

import java.io.File;
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

	//public ArrayList<FileFolder> getMyRecentList( String email);
	
	public ArrayList<FileFolder> getSearchList(String title);

	public int deleteFileFolder(int ffid);

	// 즐겨찾기 추가한 파일,폴더 삭제
	public int deleteBookmarks(HashMap<String, Object> bookmarks);

	// 공유폴더 파일 삭제
	public int deleteShare(HashMap<String, Object> shares);

	public int getMyRecentList(HashMap<String, Object> recentlist);

	// 업로드
	public int upload(FileFolder fileFolder);

	// 새폴더(경로와 이메일 정보를 가져온다.)
	public int newDir(String path, String email);

	// 파일 다운로드
	public int saveFile(String path);

	// 복원
	public void restore(String reFilePath);

	// 휴지통에서 삭제
	public void completeDelete(String path);

	public int bookmarkUpdate(HashMap<String, Object> map);

	public int bookmarkInsert(HashMap<String, Object> map);

	public FileFolder boardread(int ffid);

	public int conDelete(int ffid);

	public int conRemove(int ffid);

	public int conBookDelete(int ffid);

	public int conAllRemove(int ffid);

	public FileFolder bookmarkSearch(int ffid);

	public int folderShare(HashMap<String, Object> map);

	public int sokUpdate(HashMap<String, Object> map);

	public ArrayList<FileFolder> shareList(int ffid);

	public int shareInsert(HashMap<String, Object> map);

	public FileFolder searchShare(HashMap<String, Object> map);

	public int updateAuth(HashMap<String, Object> map);

	public int updateFileShare(int ffid);

	public int firstOwner(HashMap<String, Object> map);
	
	public int updateOwner(HashMap<String, Object> map);
}
