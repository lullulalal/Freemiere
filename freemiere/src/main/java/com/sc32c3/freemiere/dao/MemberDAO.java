package com.sc32c3.freemiere.dao;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.sc32c3.freemiere.vo.Member;

@Repository
public class MemberDAO {
	@Autowired
	SqlSession sqlSession;
	
	public Member getMember(String email){
		MemberMapper mapper = sqlSession.getMapper(MemberMapper.class);

		return mapper.getMember(email);
	}
}
