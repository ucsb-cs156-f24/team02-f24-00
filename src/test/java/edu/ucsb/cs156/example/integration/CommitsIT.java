package edu.ucsb.cs156.example.integration;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.fasterxml.jackson.databind.ObjectMapper;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.ZonedDateTime;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import edu.ucsb.cs156.example.entities.Commit;
import edu.ucsb.cs156.example.repositories.CommitRepository;
import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.services.CurrentUserService;
import edu.ucsb.cs156.example.services.GrantedAuthoritiesService;
import edu.ucsb.cs156.example.testconfig.TestConfig;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("integration")
@Import(TestConfig.class)
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class CommitsIT {
        @Autowired
        public CurrentUserService currentUserService;

        @Autowired
        public GrantedAuthoritiesService grantedAuthoritiesService;

        @Autowired
        CommitRepository commitRepsitory;

        @Autowired
        public MockMvc mockMvc;

        @Autowired
        public ObjectMapper mapper;

        @MockBean
        UserRepository userRepository;

        @WithMockUser(roles = { "USER" })
        @Test
        public void test_that_logged_in_user_can_get_by_id_when_the_id_exists() throws Exception {
                // arrange

                ZonedDateTime zdt1 = ZonedDateTime.parse("2022-01-03T00:00:00Z");

                Commit commit1 = Commit.builder()
                                .url("https://github.com/ucsb-cs156-f24/STARTER-team02/commit/e107dcbce881afa1ea70ebc93c8dfb91cebb8630")
                                .message("Merge pull request #212 from ucsb-cs156-f24/pc-update-pom-xml\n"
                                                + "pc - update version in pom.xml")
                                .authorLogin("pconrad")
                                .commitTime(zdt1)
                                .build();

                commitRepsitory.save(commit1);

                // act
                MvcResult response = mockMvc.perform(get("/api/commits?id=1"))
                                .andExpect(status().isOk()).andReturn();

                // assert
                commit1.setId(1L);
                String expectedJson = mapper.writeValueAsString(commit1);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void an_admin_user_can_post_a_new_commit() throws Exception {
                // arrange

                ZonedDateTime zdt1 = ZonedDateTime.parse("2022-01-03T00:00:00Z");

                Commit commit1 = Commit.builder()
                .id(1L)
                .url("https://github.com/ucsb-cs156-f24/STARTER-team02/commit/e107dcbce881afa1ea70ebc93c8dfb91cebb8630")
                .message("pc-updated")
                .authorLogin("pconrad")
                .commitTime(zdt1)
                .build();
             
                // act
                MvcResult response = mockMvc.perform(
                                post("/api/commits/post?message=pc-updated&url=https://github.com/ucsb-cs156-f24/STARTER-team02/commit/e107dcbce881afa1ea70ebc93c8dfb91cebb8630&authorLogin=pconrad&commitTime=2022-01-03T00:00:00Z")
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                String expectedJson = mapper.writeValueAsString(commit1);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }
}
