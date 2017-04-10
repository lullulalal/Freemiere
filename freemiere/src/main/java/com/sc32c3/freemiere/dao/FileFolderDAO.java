package com.sc32c3.freemiere.dao;

import java.util.ArrayList;
import java.util.HashMap;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.SynthesizedAnnotation;
import org.springframework.stereotype.Repository;

import com.sc32c3.freemiere.vo.FileFolder;

@Repository
public class FileFolderDAO {
	
	@Autowired
	SqlSession sqlSession;
	
	public ArrayList<FileFolder> getSharedBookmarkList(String email){
		FileFolderMapper mapper = sqlSession.getMapper(FileFolderMapper.class);

		return mapper.getSharedBookmarkList(email);
	}
	
	public ArrayList<FileFolder> getMyStorageBookmarkList(String email){
		FileFolderMapper mapper = sqlSession.getMapper(FileFolderMapper.class);

		return mapper.getMyStorageBookmarkList(email);
	}
	
	public ArrayList<FileFolder> getSharedList(String email){
		FileFolderMapper mapper = sqlSession.getMapper(FileFolderMapper.class);

		return mapper.getSharedList(email);
	}
	
	//public ArrayList<FileFolder> getMyStorageList(String email){
	//	FileFolderMapper mapper = sqlSession.getMapper(FileFolderMapper.class);

	//	return mapper.getMyStorageList(email);
	//}
	
	public ArrayList<FileFolder> getTrashList(String email){
		FileFolderMapper mapper = sqlSession.getMapper(FileFolderMapper.class);

		return mapper.getTrashList(email);
	}
	
	public FileFolder getFilerFolerInfo(String path, String email){
		FileFolderMapper mapper = sqlSession.getMapper(FileFolderMapper.class);

		return mapper.getFilerFolerInfo(path, email);
	}

	public int bookmarkUpdate(int ffid,String bookstate) {
		// TODO Auto-generated method stub
		FileFolderMapper mapper = sqlSession.getMapper(FileFolderMapper.class);
		HashMap<String, Object> map = new HashMap<>();
		map.put("ffid", ffid);
		map.put("bookstate", bookstate);
		return mapper.bookmarkUpdate(map);
	}
	
	public int bookmarkInsert(int ffid, String email){
		FileFolderMapper mapper = sqlSession.getMapper(FileFolderMapper.class);
		HashMap<String, Object> map = new HashMap<>();
		map.put("ffid", ffid);
		map.put("email", email);
		return mapper.bookmarkInsert(map);
	}
	
	public FileFolder boardread(int ffid){
		FileFolderMapper mapper = sqlSession.getMapper(FileFolderMapper.class);
		return mapper.boardread(ffid);
		
	}

	public int conDelete(int ffid){
		FileFolderMapper mapper = sqlSession.getMapper(FileFolderMapper.class);
		return mapper.conDelete(ffid);
		
	}
	//파일업로드
	public int upload(FileFolder fileFolder) {
		FileFolderMapper mapper = sqlSession.getMapper(FileFolderMapper.class);
		
		return mapper.upload(fileFolder);
	}
	
	public int conRemove(int ffid){
		FileFolderMapper mapper = sqlSession.getMapper(FileFolderMapper.class);
		return mapper.conRemove(ffid);
	}
	
	public int conAllRemove(int ffid){
		FileFolderMapper mapper = sqlSession.getMapper(FileFolderMapper.class);
		return mapper.conAllRemove(ffid);
	}
	
	public int conBookDelete(int ffid){
		FileFolderMapper mapper = sqlSession.getMapper(FileFolderMapper.class);
		return mapper.conBookDelete(ffid);
	}
	
	
	
	public FileFolder bookmarkSearch(int ffid){
		FileFolderMapper mapper = sqlSession.getMapper(FileFolderMapper.class);
		return mapper.bookmarkSearch(ffid);
	}
	public int folderShare(int ffid,String isShared) {
		// TODO Auto-generated method stub
		FileFolderMapper mapper = sqlSession.getMapper(FileFolderMapper.class);
		HashMap<String, Object> map = new HashMap<>();
		map.put("ffid", ffid);
		map.put("isShared", isShared);
		return mapper.bookmarkUpdate(map);
	}
	
	//휴지통으로 파일 폴더 이동
	public int deleteFileFolder(int ffid){
		FileFolderMapper mapper = sqlSession.getMapper(FileFolderMapper.class);
		
		return mapper.deleteFileFolder(ffid); 
	}
	//북마크된 파일 폴더 휴지통으로 이동
	public int deleteBookmarks(int ffid, String email) {
		FileFolderMapper mapper = sqlSession.getMapper(FileFolderMapper.class);
		HashMap<String, Object> bookmarks = new HashMap<>();
		bookmarks.put("ffid", ffid);
		bookmarks.put("email", email);
		
		return mapper.deleteBookmarks(bookmarks);
	}
	//공유된 폴더 휴지통으로 이동
	public int deleteShare(int ffid, String email) {
		FileFolderMapper maaper = sqlSession.getMapper(FileFolderMapper.class);
		HashMap<String, Object> shares = new HashMap<>();
		shares.put("ffid", ffid);
		shares.put("email", email);
		
		return maaper.deleteShare(shares);
	}
	//파일업로드
	public int upload(FileFolder fileFolder) {
		FileFolderMapper mapper = sqlSession.getMapper(FileFolderMapper.class);
		
		return mapper.upload(fileFolder);
	}
	
	
	
}



	
}

